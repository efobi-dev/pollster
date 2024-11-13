import { ContestInfo } from "@/components/polls/info";
import { Vote } from "@/components/polls/vote";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getContestData(id: string, userId: string) {
	const poll = await prisma.contest.findUnique({
		where: { id },
		include: {
			contestants: {
				include: {
					user: true,
					votes: true,
				},
			},
			votes: true,
			createdBy: true,
			invites: true,
		},
	});

	if (!poll) {
		notFound();
	}

	const isContestant = poll.contestants.some(
		(candidate) => candidate.userId === userId,
	);
	const isOwner = poll.userId === userId;

	return { poll, isContestant, isOwner };
}

export default async function VotePage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const authz = await auth.api.getSession({ headers: await headers() });
	if (!authz) redirect("/auth");

	const { poll, isContestant, isOwner } = await getContestData(
		id,
		authz.user.id,
	);

	if (poll.status !== "published") {
		return (
			<div className="container mx-auto py-10">
				This poll is not open for voting yet.
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-4xl font-bold mb-10">{poll.title}</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<ContestInfo poll={poll} />
				</Suspense>
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<Vote poll={poll} isContestant={isContestant} isOwner={isOwner} />
				</Suspense>
			</div>
		</div>
	);
}
