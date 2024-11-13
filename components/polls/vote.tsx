"use client";

import { vote } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import { voteSchema } from "@/lib/constants";
import type { ContestDetails } from "@/lib/types";
import type { ZVote } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Form, FormField } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function Vote({
	poll,
	isContestant,
	isOwner,
}: { poll: ContestDetails; isContestant: boolean; isOwner: boolean }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const form = useForm<ZVote>({
		resolver: zodResolver(voteSchema),
		defaultValues: {
			contestantId: "",
			contestId: poll.id,
		},
	});
	const submit = async (values: ZVote) => {
		setLoading(true);
		try {
			const { error, message } = await vote(values);
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
	const canVote =
		!isContestant &&
		!isOwner &&
		new Date() >= new Date(poll.startDate) &&
		new Date() <= new Date(poll.endDate);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cast your vote</CardTitle>
				<CardDescription>Select a candidate to vote for</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)}>
						<FormField
							name="contestantId"
							render={({ field }) => (
								<RadioGroup onValueChange={field.onChange}>
									{poll.contestants.map((candidate) => (
										<RadioGroupItem
											className={`flex items-center justify-between p-4 rounded-lg ${
												form.getValues("contestantId") === candidate.id
													? "bg-primary/10 border-primary"
													: ""
											}`}
											key={candidate.id}
											value={candidate.id}
										>
											<div className="flex items-center space-x-4">
												<Avatar>
													<AvatarImage src={candidate.user.image ?? ""} />
													<AvatarFallback>
														{candidate.user.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{candidate.user.name}</p>
													<p className="text-sm text-muted-foreground">
														{candidate.votes.length} votes
													</p>
												</div>
											</div>
											{form.getValues("contestantId") === candidate.id && (
												<Badge variant={"secondary"}>Your vote</Badge>
											)}
										</RadioGroupItem>
									))}
								</RadioGroup>
							)}
						/>
						{canVote ? (
							<Button type="submit" disabled={loading} className="w-full">
								{loading ? "Voting..." : "Vote"}
							</Button>
						) : (
							<p className="text-center text-muted-foreground">
								{isContestant
									? "As a candidate, you cannot vote in this poll."
									: isOwner
										? "As the poll owner, you cannot vote in this poll."
										: new Date() < new Date(poll.startDate)
											? "Voting has not started yet."
											: "Voting has ended for this poll."}
							</p>
						)}
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
