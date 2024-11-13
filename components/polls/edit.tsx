"use client";

import { editContest } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import type { Draft } from "@/lib/types";
import { contestModel } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Archive, CalendarIcon, Loader, Pencil, Satellite } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

export function EditDialog({ draft }: { draft: Draft }) {
	const { toast } = useToast();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();
	const {
		id,
		title,
		description,
		startDate,
		endDate,
		status,
		createdAt,
		updatedAt,
		userId,
	} = draft;
	const form = useForm<Draft>({
		resolver: zodResolver(contestModel),
		defaultValues: {
			id,
			title,
			description,
			startDate,
			endDate,
			status,
			createdAt,
			updatedAt,
			userId,
		},
	});
	const submit = (values: Draft) => {
		startTransition(async () => {
			try {
				const { error, message } = await editContest(values);
				if (error) {
					toast({
						title: "Error",
						description: error,
						variant: "destructive",
					});
					return;
				}
				toast({
					title: "poll created",
					description: message,
				});
				if (draft.status !== "draft") router.push(`/poll/${draft.id}`);
			} catch (error) {
				console.error(error);
				toast({
					title: "Error",
					description: "Internal server error",
					variant: "destructive",
				});
			} finally {
				setOpen(false);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Preview, edit and publish</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)}>
						<FormField
							name="title"
							label="Title"
							render={({ field }) => <Input {...field} />}
						/>
						<FormField
							name="description"
							label="Poll description"
							render={({ field }) => <Textarea {...field} />}
						/>
						<FormField
							name="startDate"
							label="Start date"
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={`w-[240px] pl-3 text-left font-normal ${
												!field.value && "text-muted-foreground"
											}`}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date < new Date() || date < new Date("1900-01-01")
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							)}
						/>
						<FormField
							name="endDate"
							label="Start date"
							description=""
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={`w-[240px] pl-3 text-left font-normal ${
												!field.value && "text-muted-foreground"
											}`}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date < new Date() || date < new Date("1900-01-01")
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							)}
						/>
						<FormField
							name="status"
							label="Publish?"
							render={({ field }) => (
								<RadioGroup
									defaultValue={field.value}
									onValueChange={field.onChange}
									className="flex items-center gap-4 px-2"
								>
									<RadioGroupItem
										value="draft"
										className="flex flex-col items-center gap-1"
									>
										<Archive className="w-4 h-4" />
										<span className="text-xl text-muted-foreground">No</span>
									</RadioGroupItem>
									<RadioGroupItem
										value="published"
										className="flex flex-col items-center gap-1"
									>
										<Satellite className="w-4 h-4" />
										<span className="text-xl text-muted-foreground">Yes</span>
									</RadioGroupItem>
								</RadioGroup>
							)}
						/>
						<Button type="submit" disabled={pending}>
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
			</DialogContent>
		</Dialog>
	);
}
