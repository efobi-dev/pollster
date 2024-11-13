"use client";

import type { ContestDetails } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export function ContestAnalytics({ poll }: { poll: ContestDetails }) {
	const totalVotes = poll.votes ? poll.votes.length : 0;
	const contestDuration = Math.ceil(
		(new Date(poll.endDate).getTime() - new Date(poll.startDate).getTime()) /
			(1000 * 3600 * 24),
	);
	const averageVotesPerDay = totalVotes / contestDuration;

	const votesOverTime = calculateVotesOverTime(poll);
	const contestantPerformance = calculateContestantPerformance(poll);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Poll Analytics</CardTitle>
				<CardDescription>Key metrics and performance data</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<p className="text-2xl font-bold">{totalVotes}</p>
							<p className="text-sm text-muted-foreground">Total Votes</p>
						</div>
						<div className="space-y-1">
							<p className="text-2xl font-bold">
								{averageVotesPerDay.toFixed(2)}
							</p>
							<p className="text-sm text-muted-foreground">Avg. Votes/Day</p>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">Votes Over Time</h3>
						<ChartContainer
							config={{
								votes: {
									label: "Votes",
									color: "hsl(var(--chart-1))",
								},
							}}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={votesOverTime}>
									<XAxis dataKey="date" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="votes" fill="var(--color-votes)" />
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">
							Candidate performance
						</h3>
						<ChartContainer
							config={{
								votes: {
									label: "Votes",
									color: "hsl(var(--chart-2))",
								},
							}}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={contestantPerformance}>
									<XAxis dataKey="name" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="votes" fill="var(--color-votes)" />
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function calculateVotesOverTime(poll: ContestDetails) {
	const votesMap = new Map<string, number>();
	for (const vote of poll.votes) {
		const date = new Date(vote.createdAt).toISOString().split("T")[0];
		votesMap.set(date, (votesMap.get(date) || 0) + 1);
	}

	const sortedDates = Array.from(votesMap.keys()).sort();
	return sortedDates.map((date) => ({
		date,
		votes: votesMap.get(date) || 0,
	}));
}
function calculateContestantPerformance(poll: ContestDetails) {
	return poll.contestants.map((candidate) => ({
		name: candidate.user.name || "Anonymous",
		votes: candidate.votes.length,
	}));
}
