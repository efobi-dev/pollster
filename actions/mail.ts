"use server";

import { inviteUserHtml } from "@/components/emails/invite-contestant";
import { auth } from "@/lib/auth";
import { inviteSchema } from "@/lib/constants";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import type { ZInvite } from "@/lib/types";
import { headers } from "next/headers";
import { createTransport } from "nodemailer";

const transporter = createTransport({
	host: env.SMTP_SERVER_HOST,
	port: 587,
	auth: {
		user: env.SMTP_SERVER_USER,
		pass: env.SMTP_KEY,
	},
});

export async function inviteUser(values: ZInvite) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const { data, error } = await inviteSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const { invitedEmail, contestId, contestName, inviterId } = data;
		const invite = await prisma.invite.create({
			data: { invitedEmail, contestId, inviterId },
		});
		if (!invite) return { error: "Failed to create invite" };
		const body = await inviteUserHtml({
			inviterEmail: authz.user.email,
			inviterUsername: authz.user.name,
			invitedUserEmail: invitedEmail,
			inviterIp: authz.session.ipAddress || "",
			inviteLink: `https://${process.env.VERCEL_URL}/invites/${invite.id}`,
			contestName: contestName,
		});
		const mail = await transporter.sendMail({
			from: env.EMAIL_FROM,
			to: invitedEmail,
			subject: "Invitation to participate in poll",
			html: body,
		});
		console.log("Mail response: ", mail.response);
		if (!mail) {
			await prisma.invite.delete({ where: { id: invite.id } });
			return { error: "Failed to send mail" };
		}
		return { success: true, message: "Invite sent successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}
