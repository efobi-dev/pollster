import type { PartialContest } from "@/lib/types";
import { StepBack, StepForward, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Progress } from "../ui/progress";

export function ContestOverview({ contests }: { contests: PartialContest[] }) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{contests.map((poll) => {
				const totalVotes = poll.votes.length;
				const performance =
					totalVotes > 0
						? poll.contestants.reduce((acc, candidate) => {
								const contestantVotes = poll.votes.filter(
									(vote) => vote.contestantId === candidate.id,
								).length;
								return acc + (contestantVotes / totalVotes) * 100;
							}, 0) / poll.contestants.length
						: 0;

				return (
					<Card key={poll.id}>
						<CardHeader>
							<CardTitle>{poll.title}</CardTitle>
							<CardDescription>{poll.description}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="flex items-center">
									<Users className="mr-2 h-4 w-4" />
									{poll.votes.length} voters
								</span>
								<span>{poll.contestants.length} contestants</span>
							</div>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm font-medium">Performance</span>
								<span className="text-sm font-medium">
									{performance.toFixed(1)}%
								</span>
							</div>
							<Progress value={performance} className="h-2" />
							<Dialog>
								<DialogTrigger asChild>
									<Button className="w-full">View details</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{poll.title}</DialogTitle>
										<DialogDescription>
											<div className="flex items-center justify-between">
												<div className="flex flex-col gap-1">
													<div className="flex items-center gap-2">
														<StepBack className="w-4 h-4" />
														<p className="text-muted-foreground">Start </p>
													</div>
													<span className="font-semibold text-md">
														{new Date(poll.startDate).toLocaleString()}
													</span>
												</div>
												<div className="flex flex-col gap-1">
													<div className="flex items-center gap-2">
														<p className="text-muted-foreground">End </p>
														<StepForward className="w-4 h-4" />
													</div>
													<span className="font-semibold text-md">
														{new Date(poll.endDate).toLocaleString()}
													</span>
												</div>
											</div>
										</DialogDescription>
									</DialogHeader>
									<div className="mt-4">
										<h4 className="font-medium mb-2"> Top Contestants</h4>
										<ul className="space-y-2">
											{poll.contestants.map((candidate) => (
												<li
													key={candidate.id}
													className="flex justify-between items-center"
												>
													<span>{candidate.user.name}</span>
												</li>
											))}
										</ul>
									</div>
									<Link href={`/polls/${poll.id}`}>
										<Button>Go to poll</Button>
									</Link>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
