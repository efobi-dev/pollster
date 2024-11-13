"use client";

import { updateInvite } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import type { InviteInfo } from "@/lib/types";
import { inviteModel } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Invite } from "@prisma/client";
import { Check, Copy, Loader, Share2, Sunrise, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

export function InviteAction({
	invite,
	isInvitee,
}: {
	invite: InviteInfo;
	isInvitee: boolean;
}) {
	const { toast } = useToast();
	const [socialPost, setSocialPost] = useState("");
	const [pending, startTransition] = useTransition();
	const {
		id,
		invitedId,
		invitedEmail,
		inviterId,
		contestId,
		status,
		updatedAt,
		createdAt,
	} = invite;
	const [response, setResponse] = useState<"accepted" | "rejected" | "pending">(
		status,
	);
	const form = useForm<Invite>({
		resolver: zodResolver(inviteModel),
		defaultValues: {
			id,
			invitedEmail,
			invitedId,
			inviterId,
			contestId,
			status,
			createdAt,
			updatedAt,
		},
	});
	const submit = (values: Invite) => {
		startTransition(async () => {
			try {
				const { error, message } = await updateInvite(values);
				if (error) {
					toast({
						title: "Error",
						description: error,
						variant: "destructive",
					});
					return;
				}
				toast({
					title: "Success",
					description: message,
				});
				setResponse(form.getValues("status"));
			} catch (error) {
				console.error(error);
				toast({
					title: "Error",
					description: "There was a problem updating the invitation",
					variant: "destructive",
				});
			}
		});
	};
	const handleShareSocial = async () => {
		const shareText =
			socialPost ||
			`I'm participating in the "${invite.contest.title}" contest! Come support me and vote!`;
		const shareUrl = `${window.location.origin}/polls/${invite.contestId}`;

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
				title: "Sharing failed",
				description: "Unable to share. You can copy the text and URL manually.",
				variant: "destructive",
			});
		}
	};

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(
				`${typeof window !== "undefined" ? window.location.origin : ""}/vote/${invite.contestId}`,
			);
			toast({
				title: "Copied to clipboard",
			});
		} catch (error) {
			console.error("Failed to copy text: ", error);
			toast({
				title: "Failed to copy",
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
				{response === "pending" ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(submit)}
							className="grid gap-4 place-content-center"
						>
							<FormField
								name="status"
								render={({ field }) => (
									<RadioGroup
										onValueChange={field.onChange}
										className="flex gap-4"
									>
										<div className="flex flex-col items-center">
											<RadioGroupItem value="accepted" id="accepted" />
											<div className="flex flex-col items-center">
												<Check className="w-4 h-4 text-foreground" />
												<span className="text-xl text-primary">Accept</span>
											</div>
										</div>
										<div className="flex flex-col items-center">
											<RadioGroupItem value="rejected" id="rejected" />
											<div className="flex flex-col items-center">
												<X className="w-4 h-4 text-destructive" />
												<span className="text-xl text-destructive">
													Decline
												</span>
											</div>
										</div>
									</RadioGroup>
								)}
							/>
							<Button type="submit">
								{pending ? (
									<>
										<Loader className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									"Save"
								)}
							</Button>
						</form>
					</Form>
				) : response === "accepted" ? (
					<div className="grid gap-4">
						<div className="flex items-center space-x-2">
							<Sunrise className="h-5 w-5 text-green-500" />
							<p>You've accepted this invitation and joined the contest.</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="socialPost">Share your participation</Label>
							<Textarea
								id="socialPost"
								placeholder="I'm excited to be part of this contest!"
								value={socialPost}
								onChange={(e) => setSocialPost(e.target.value)}
							/>
						</div>
						<Button onClick={handleShareSocial}>
							<Share2 className="mr-2 h-4 w-4" />
							Share to social media
						</Button>
					</div>
				) : (
					<div>You have Successfully rejected this invite</div>
				)}
				<div className="pt-4 border-t">
					<div className="text-sm text-muted-foreground">
						<h3 className="text-primary font-semibold">Contest voting link:</h3>
						<div className="flex items-center gap-2">
							<Input
								value={`${typeof window !== "undefined" ? window.location.origin : ""}/vote/${invite.contestId}`}
								autoFocus
								readOnly
							/>
							<Button size={"icon"} onClick={copy}>
								<Copy className="w-4 h-4" />
							</Button>
						</div>
					</div>
					<p className="text-sm text-muted-foreground mt-2">
						Share this link with your friends so they can vote for you!
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
