"use server";

import { auth } from "@/lib/auth";
import { contestSchema, voteSchema } from "@/lib/constants";
import prisma from "@/lib/db";
import type { Draft, ZContest, ZVote } from "@/lib/types";
import { contestModel, inviteModel } from "@/prisma/zod";
import type { Invite } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createContest(values: ZContest) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const { data, error } = await contestSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const { title, description, startDate, endDate } = data;
		const poll = await prisma.contest.create({
			data: {
				title,
				description,
				startDate,
				endDate,
				userId: authz.user.id,
			},
		});
		if (!poll) return { error: "Failed to create poll" };
		return {
			success: true,
			message: "Your new poll has been successfully created at",
		};
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function editContest(values: Draft) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const { data, error } = await contestModel.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const updateContest = await prisma.contest.update({
			where: { id: data.id },
			data,
		});
		if (!updateContest) return { error: "Failed to update contest" };
		revalidatePath("/contests/drafts");
		return { success: true, message: "Updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function deleteContest(id: string) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const poll = await prisma.contest.findUnique({ where: { id } });
		if (!poll) return { error: "Could not find poll" };
		if (poll.userId !== authz.user.id)
			return { error: "You are unauthorized to perform this action" };
		const deleted = await prisma.contest.delete({ where: { id } });
		if (!deleted) return { error: "Failed to delete poll" };
		revalidatePath("/contests/drafts");
		return { success: true, message: "Deleted successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function updateInvite(values: Invite) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const { data, error } = await inviteModel.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const invite = await prisma.invite.findUnique({ where: { id: data.id } });
		if (!invite)
			return {
				error: "Your invite may have been deleted, as it does not exist",
			};
		if (invite.invitedEmail !== authz.user.email)
			return { error: "You are not permitted to do this" };
		const response = await prisma.invite.update({
			where: { id: data.id },
			data,
		});
		if (!response) return { error: "Failed to save" };
		if (response.status === "accepted") {
			const contestant = await prisma.contestant.create({
				data: {
					userId: authz.user.id,
					contestId: invite.contestId,
				},
			});
			if (!contestant) return { error: "Failed to save" };
		}
		return { success: true, message: "Saved successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function deleteInvite(id: string) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const invite = await prisma.invite.findUnique({ where: { id } });
		if (!invite) return { error: "Invite does not exist" };
		if (invite.inviterId !== authz.user.id)
			return { error: "You are unauthorized to perform this action" };
		const deleted = await prisma.invite.delete({ where: { id } });
		if (!deleted) return { error: "Failed to delete invite" };
		revalidatePath(`/contests/${invite.contestId}`);
		return { success: true, message: "Deleted successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function vote(values: ZVote) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz) return { error: "Unauthorized" };
		const { data, error } = await voteSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const { contestId, contestantId } = data;
		const poll = await prisma.contest.findUnique({
			where: { id: contestId },
			include: { contestants: true },
		});
		if (!poll) return { error: "Contest not found" };
		if (poll.userId === authz.user.id) {
			return { error: "poll owners cannot vote in their own contests" };
		}

		const isContestant = poll.contestants.some(
			(candidate) => candidate.userId === authz.user.id,
		);
		if (isContestant) {
			return { error: "Contestants cannot vote in their own contests" };
		}
		const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
		const recentVotes = await prisma.vote.count({
			where: {
				userId: authz.user.id,
				createdAt: {
					gte: oneMinuteAgo,
				},
			},
		});
		if (recentVotes > 0) {
			return { error: "Rate limit exceeded. Please wait before voting again." };
		}
		const vote = await prisma.vote.create({
			data: {
				userId: authz.user.id,
				contestId,
				contestantId,
			},
		});
		if (!vote) return { error: "Failed to vote" };
		revalidatePath(`/contests/vote/${poll.id}`);
		return { success: true, message: "Vote recorded successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}
