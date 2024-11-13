"use client";

import type { Contest, Contestant } from "@prisma/client";
import { Calendar, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export function InviteDetails({
	poll,
}: { poll: Contest & { contestants: Contestant[] } }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<h2>{poll.title}</h2>
					<Badge variant="secondary">
						{new Date() < new Date(poll.startDate)
							? "Upcoming"
							: new Date() > new Date(poll.endDate)
								? "Ended"
								: "Active"}
					</Badge>
				</CardTitle>
				<CardDescription>{poll.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center space-x-4">
						<Calendar className="h-5 w-5 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{new Date(poll.startDate).toLocaleDateString()} -{" "}
								{new Date(poll.endDate).toLocaleDateString()}
							</p>
							<p className="text-sm text-muted-foreground">Poll Duration</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Users className="h-5 w-5 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{poll.contestants.length} contestants
							</p>
							<p className="text-sm text-muted-foreground">
								Current Participants
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
