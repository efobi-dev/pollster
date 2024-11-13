"use client";

import { deleteContest } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import type { PartialContest } from "@/lib/types";
import { Eye, Loader, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { AddContestantsDialog } from "./contestant";
import { EditDialog } from "./edit";

export function DraftContests({ drafts }: { drafts: PartialContest[] }) {
	const { toast } = useToast();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const handleDelete = async (id: string) => {
		setLoading(true);
		try {
			const { error, message } = await deleteContest(id);
			if (error) {
				toast({
					title: "Something went wrong",
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
				description:
					"There was a problem deleting your poll. Please try again later",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return drafts.length > 0 ? (
		<div className="space-y-4">
			{drafts.map((draft) => (
				<Card key={draft.id}>
					<CardHeader>
						<CardTitle>{draft.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-accent-foreground mb-2">{draft.description}</p>
						<p className="text-sm text-muted-foreground">
							Created: {new Date(draft.createdAt).toLocaleDateString()}
						</p>
						<div className="flex items-center justify-between gap-2">
							<p className="text-sm text-muted-foreground">
								Contestants: {draft.contestants.length}
							</p>
							<AddContestantsDialog
								userId={draft.userId}
								contestId={draft.id}
								contestName={draft.title}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end space-x-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => router.push(`/polls/${draft.id}`)}
						>
							<Eye className="h-4 w-4" />
						</Button>
						<EditDialog draft={draft} />
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" size="icon" disabled={loading}>
									{loading ? (
										<Loader className="w-4 h-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4 text-destructive-foreground" />
									)}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your draft poll.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={() => handleDelete(draft.id)}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardFooter>
				</Card>
			))}
		</div>
	) : (
		<p>You don't have any drafts yet</p>
	);
}
