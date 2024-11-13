import { ContestAnalytics } from "@/components/polls/analytics";
import { ContestDetail } from "@/components/polls/details";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const poll = await prisma.contest.findUnique({
		where: { id },
		include: {
			contestants: { include: { user: true, votes: true } },
			votes: true,
			createdBy: true,
			invites: true,
		},
	});
	const authz = await auth.api.getSession({ headers: await headers() });
	if (!authz) return redirect("/auth");

	if (!poll) return notFound();
	if (poll.status === "draft" && poll.userId !== authz.user.id) {
		return (
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold">This page is not available</h1>
				<p className="mt-4">
					This poll is currently in draft mode and cannot be viewed.
				</p>
			</div>
		);
	}
	if (poll.userId === authz.user.id)
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-4xl font-bold mb-10">{poll.title}</h1>
				<div className="grid gap-6 md:grid-cols-2">
					<Suspense fallback={<Skeleton className="h-[300px]" />}>
						<ContestAnalytics poll={poll} />
					</Suspense>
					<Suspense fallback={<Skeleton className="h-[300px]" />}>
						<ContestDetail poll={poll} />
					</Suspense>
				</div>
			</div>
		);
	return redirect(`poll/vote/${poll.id}`);
}
