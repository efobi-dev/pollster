import { InviteAction } from "@/components/invites/action";
import { InviteDetails } from "@/components/invites/info";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authz = await auth.api.getSession({ headers: await headers() });
	if (!authz) {
		redirect("/auth");
	}
	const invite = await prisma.invite.findUnique({
		where: { id },
		include: {
			contest: {
				include: {
					contestants: true,
				},
			},
		},
	});
	if (!invite) {
		notFound();
	}
	const isInvitee = invite.invitedEmail === authz.user.email;
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-4xl font-bold mb-10">Poll Invitation</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<InviteDetails poll={invite.contest} />
				</Suspense>
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<InviteAction invite={invite} isInvitee={isInvitee} />
				</Suspense>
			</div>
		</div>
	);
}
