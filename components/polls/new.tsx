"use client";

import { createContest } from "@/actions/poll";
import { useToast } from "@/hooks/use-toast";
import { contestSchema } from "@/lib/constants";
import type { ZContest } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

export function NewContest() {
	const { toast } = useToast();
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const form = useForm<ZContest>({
		resolver: zodResolver(contestSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});
	const submit = (values: ZContest) => {
		startTransition(async () => {
			try {
				const { error, message } = await createContest(values);
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
				router.push("/polls/drafts");
			} catch (error) {
				console.error(error);
				toast({
					title: "Error",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<div className="container mx-auto p-10">
			<h1 className="text-4xl font-bold mb-10">Create new poll</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
					<FormField
						name="title"
						label="Title"
						description="Give your poll a catchy title"
						render={({ field }) => (
							<Input placeholder="Enter poll title" {...field} />
						)}
					/>
					<FormField
						name="description"
						label="Description"
						description="Provide details about your poll, rules, etc."
						render={({ field }) => (
							<Textarea placeholder="Enter poll description" {...field} />
						)}
					/>
					<FormField
						name="startDate"
						label="Start date"
						className="flex items-center justify-between"
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild className="w-full">
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
						label="End date"
						className="flex items-center justify-between"
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild className="w-full">
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
					<Button type="submit" disabled={pending}>
						{pending ? (
							<span className="flex items-center">
								<Loader className="animate-spin w-4 h-4" /> Creating...
							</span>
						) : (
							"Create poll"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
