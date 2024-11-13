import { DraftContests } from "@/components/polls/drafts";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function Page() {
	const data = await auth.api.getSession({
		headers: await headers(),
	});

	const contests = await prisma.contest.findMany({
		where: { userId: data?.user.id, status: "draft" },
		include: {
			contestants: {
				include: { user: true },
			},
			votes: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-4xl font-bold mb-10">Your Draft Contests</h1>
			<Suspense fallback={<DraftsSkeleton />}>
				<DraftContests drafts={contests} />
			</Suspense>
		</div>
	);
}

function DraftsSkeleton() {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: index used for iteration
				<Skeleton key={i} className="h-[100px] w-full" />
			))}
		</div>
	);
}
