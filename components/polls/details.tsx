"use client";

import { deleteInvite } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import type { ContestDetails } from "@/lib/types";
import { Calendar, Users } from "lucide-react";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { AddContestantsDialog } from "./contestant";

export function ContestDetail({ poll }: { poll: ContestDetails }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const handleDelete = async (id: string) => {
		setLoading(true);
		try {
			const { error, message } = await deleteInvite(id);
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
		} catch (error) {
			console.error(error);
			toast({
				title: "Something went wrong",
				description: "Internal server error",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Poll details</CardTitle>
				<CardDescription>{poll.description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">
						Last updated: {new Date(poll.updatedAt).toLocaleDateString()}
					</span>
					<Badge
						variant={poll.status === "published" ? "default" : "secondary"}
					>
						{poll.status}
					</Badge>
				</div>
				<div className="flex items-center space-x-4">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">
							{new Date(poll.startDate).toLocaleDateString()} -{" "}
							{new Date(poll.endDate).toLocaleDateString()}
						</p>
						<p className="text-sm text-muted-foreground">Poll duration</p>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<Users className="h-4 w-4 text-muted-foreground" />
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">
							{poll.votes.length} votes
						</p>
						<p className="text-sm text-muted-foreground">
							{poll.contestants.length} contestants
						</p>
					</div>
				</div>
				{poll.contestants.length > 0 ? (
					<div>
						<h3 className="text-lg font-semibold mb-2">Top Contestants</h3>
						<div className="space-y-2">
							{poll.contestants
								.sort((a, b) => b.votes.length - a.votes.length)
								.slice(0, 3)
								.map((candidate) => (
									<div
										key={candidate.id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center space-x-2">
											<Avatar>
												<AvatarImage src={candidate.user.image || undefined} />
												<AvatarFallback>
													{candidate.user.name?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span>{candidate.user.name}</span>
										</div>
										<span>{candidate.votes.length} votes</span>
									</div>
								))}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4 p-4">
						<h3>You currently do not have contestants</h3>
						<AddContestantsDialog
							userId={poll.userId}
							contestId={poll.id}
							contestName={poll.title}
						/>
					</div>
				)}
				<div>
					{poll.invites.length > 0 ? (
						<ul className="flex items-center">
							{poll.invites.map((invites) => (
								<li
									key={invites.id}
									className="flex items-center justify-between gap-4"
								>
									<div className="flex flex-col items-center gap-1">
										<p>
											<span className="text-accent-foreground font-semibold italic">
												{invites.invitedEmail}
											</span>{" "}
											was invited at{" "}
											<span className="text-sm text-muted-foreground">
												{new Date(invites.createdAt).toLocaleDateString()}
											</span>
										</p>
										{invites.status === "accepted" ? (
											<p>
												Your invite was accepted on{" "}
												<span className="text-sm text-muted-foreground">
													{new Date(invites.updatedAt).toLocaleDateString()}
												</span>
											</p>
										) : invites.status === "rejected" ? (
											<p>
												Your invited was rejected on{" "}
												<span className="text-sm text-muted-foreground">
													{new Date(invites.updatedAt).toLocaleDateString()}
												</span>
											</p>
										) : (
											<p>Your invite is still pending a response</p>
										)}
									</div>
									<div className="flex flex-col items-center gap-1">
										<Badge
											variant={
												invites.status === "rejected"
													? "destructive"
													: invites.status === "pending"
														? "outline"
														: "default"
											}
										>
											{invites.status}
										</Badge>
										{invites.status === "pending" ||
										invites.status === "rejected" ? (
											<Button
												size={"icon"}
												onClick={() => handleDelete(invites.id)}
												disabled={loading}
												variant={"destructive"}
											>
												{loading ? (
													<Loader className="animate-spin w-4 h-4" />
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</Button>
										) : (
											""
										)}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p>You have not invited anybody for this poll</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
