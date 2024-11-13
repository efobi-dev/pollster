"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import type { Contest, ContestInvitation } from "@prisma/client";
import { Check, Share2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type InviteActionsProps = {
	invite: ContestInvitation & {
		contest: Contest;
	};
	isInvitee: boolean;
	hasAccepted: boolean;
	userEmail: string | null | undefined;
};

export function InviteActions({
	invite,
	isInvitee,
	hasAccepted,
}: InviteActionsProps) {
	const [isAccepting, setIsAccepting] = useState(false);
	const [socialPost, setSocialPost] = useState("");
	const router = useRouter();

	const handleAcceptInvite = async () => {
		setIsAccepting(true);
		try {
			const response = await fetch("/api/invites/accept", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					inviteId: invite.id,
					contestId: invite.contestId,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to accept invitation");
			}

			toast({
				title: "Invitation Accepted",
				description: "You have successfully joined the contest!",
			});
			router.refresh();
		} catch (error) {
			console.error("Error accepting invitation:", error);
			toast({
				title: "Error",
				description:
					"There was a problem accepting the invitation. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsAccepting(false);
		}
	};

	const handleShareSocial = async () => {
		const shareText =
			socialPost ||
			`I'm participating in the "${invite.contest.title}" contest! Come support me and vote!`;
		const shareUrl = `${window.location.origin}/contests/${invite.contestId}`;

		try {
			await navigator.share({
				title: invite.contest.title,
				text: shareText,
				url: shareUrl,
			});
			toast({
				title: "Shared Successfully",
				description: "Your contest participation has been shared!",
			});
		} catch (error) {
			console.error("Error sharing:", error);
			toast({
				title: "Sharing Failed",
				description: "Unable to share. You can copy the text and URL manually.",
				variant: "destructive",
			});
		}
	};

	if (!isInvitee) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Invalid Invitation</CardTitle>
					<CardDescription>
						This invitation is not for your account.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Invitation</CardTitle>
				<CardDescription>
					Take action on your contest invitation
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{!hasAccepted ? (
					<div className="space-y-2">
						<p>You've been invited to participate in this contest!</p>
						<Button onClick={handleAcceptInvite} disabled={isAccepting}>
							{isAccepting ? "Accepting..." : "Accept Invitation"}
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Check className="h-5 w-5 text-green-500" />
							<p>You've accepted this invitation and joined the contest.</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="socialPost">Share your participation</Label>
							<Input
								id="socialPost"
								placeholder="I'm excited to be part of this contest!"
								value={socialPost}
								onChange={(e) => setSocialPost(e.target.value)}
							/>
							<Button onClick={handleShareSocial}>
								<Share2 className="mr-2 h-4 w-4" />
								Share on Social Media
							</Button>
						</div>
					</div>
				)}
				<div className="pt-4 border-t">
					<p className="text-sm text-muted-foreground">
						Contest voting link:
						<a
							href={`/contests/${invite.contestId}`}
							className="ml-1 text-primary hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{`${typeof window !== "undefined" ? window.location.origin : ""}/contests/${invite.contestId}`}
						</a>
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Share this link with your supporters so they can vote for you!
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
