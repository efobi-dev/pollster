"use client";

import { useToast } from "@/hooks/use-toast";
import type { ContestDetails } from "@/lib/types";
import { Calendar, Share2, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export async function ContestInfo({ poll }: { poll: ContestDetails }) {
	const { toast } = useToast();
	const handleShare = async () => {
		try {
			await navigator.share({
				title: poll.title,
				text: `Vote in the "${poll.title}" poll!`,
				url: window.location.href,
			});
		} catch (error) {
			console.error("Error sharing:", error);
			toast({
				title: "Sharing failed",
				description: "Unable to share the poll. You can copy the URL manually.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>poll Information</CardTitle>
				<CardDescription>{poll.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Badge variant="secondary">
							{new Date() < new Date(poll.startDate)
								? "Upcoming"
								: new Date() > new Date(poll.endDate)
									? "Ended"
									: "Active"}
						</Badge>
						<Button variant="outline" size="sm" onClick={handleShare}>
							<Share2 className="mr-2 h-4 w-4" />
							Share
						</Button>
					</div>
					<div className="flex items-center space-x-4">
						<Calendar className="h-5 w-5 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{new Date(poll.startDate).toLocaleDateString()} -{" "}
								{new Date(poll.endDate).toLocaleDateString()}
							</p>
							<p className="text-sm text-muted-foreground">poll Duration</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Users className="h-5 w-5 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{poll.votes.length} votes
							</p>
							<p className="text-sm text-muted-foreground">
								{poll.contestants.length} contestants
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
