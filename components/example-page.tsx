import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContestInfo } from "./contest-info";
import { InviteActions } from "./invite-actions";

async function getInviteData(id: string, email: string | null) {
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

	const isInvitee = invite.invitedEmail === email;
	const hasAccepted = invite.contest.contestants.some(
		(contestant) => contestant.userId === userId,
	);

	return { invite, isInvitee, hasAccepted };
}

export default async function InvitePage({
	params,
}: { params: { id: string } }) {
	const session = await getServerSession(authOptions);
	const { invite, isInvitee, hasAccepted } = await getInviteData(
		params.id,
		session?.user?.email || null,
	);

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-4xl font-bold mb-10">Contest Invitation</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<ContestInfo contest={invite.contest} />
				</Suspense>
				<Suspense fallback={<Skeleton className="h-[300px]" />}>
					<InviteActions
						invite={invite}
						isInvitee={isInvitee}
						hasAccepted={hasAccepted}
						userEmail={session?.user?.email}
					/>
				</Suspense>
			</div>
		</div>
	);
}
