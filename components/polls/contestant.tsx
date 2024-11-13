"use client";

import { inviteUser } from "@/actions/mail";
import { useToast } from "@/hooks/use-toast";
import { inviteSchema } from "@/lib/constants";
import type { ZInvite } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, UserSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";

export function AddContestantsDialog({
	userId,
	contestId,
	contestName,
}: { userId: string; contestId: string; contestName: string }) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const form = useForm<ZInvite>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			invitedEmail: "",
			inviterId: userId,
			contestId: contestId,
			contestName: contestName,
		},
	});
	const submit = (values: ZInvite) => {
		startTransition(async () => {
			try {
				const { message, error } = await inviteUser(values);
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
				form.reset();
				setOpen(false);
				router.refresh();
			}
		});
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"sm"} className="flex items-center gap-1">
					<Plus />
					<UserSquare />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Input the prospective candidate's email</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
						<FormField
							name="invitedEmail"
							label="Prospective candidate's email"
							render={({ field }) => <Input type="email" required {...field} />}
						/>
						<Button disabled={pending}>
							{pending ? (
								<>
									<Loader className="animate-spin w-4 h-4" /> sending...
								</>
							) : (
								"Invite user"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
