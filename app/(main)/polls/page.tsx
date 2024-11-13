import { ContestOverview } from "@/components/polls/overview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
	const data = await auth.api.getSession({
		headers: await headers(),
	});

	const contests = await prisma.contest.findMany({
		where: { userId: data?.user.id },
		include: {
			contestants: {
				include: { user: true },
			},
			votes: true,
		},
	});

	return (
		<Suspense fallback={<ContestsSkeleton />}>
			{contests.length > 0 ? (
				<div className="container mx-auto py-10">
					<h1 className="text-4xl font-bold mb-10">Your contests</h1>
					<ContestOverview contests={contests} />
				</div>
			) : (
				<div className="flex flex-col items-center gap-4 p-4 justify-center">
					<h2>You currently do not have an active poll</h2>
					<p>Create one now!</p>
					<Link href={"/polls/new"}>
						<Button>Create</Button>
					</Link>
				</div>
			)}
		</Suspense>
	);
}

function ContestsSkeleton() {
	return (
		<div className="space-y-6">
			{[...Array(3)].map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: needed for iterating
				<Skeleton key={i} className="h-[200px] w-full" />
			))}
		</div>
	);
}
