"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth.client";
import { signInSchema } from "@/lib/constants";
import type { SignIn } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { GoogleButton } from "./google-button";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";

export function SignInCard() {
	const router = useRouter();
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const form = useForm<SignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const submit = (values: SignIn) => {
		const { email, password } = values;
		startTransition(async () => {
			try {
				const { error } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/dashboard",
				});
				if (error) {
					toast({
						title: "Something went wrong",
						description: error.message,
						variant: "destructive",
					});
					return;
				}
				router.back();
			} catch (error) {
				console.error(error);
				toast({
					title: "Something went wrong",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Log in</CardTitle>
				<CardDescription>Log in to your account to continue</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
						<FormField
							name="email"
							label="Email address"
							className="grid gap-1"
							render={({ field }) => (
								<Input {...field} type="email" autoComplete="email" />
							)}
						/>
						<FormField
							name="password"
							label="Password"
							className="grid gap-1"
							render={({ field }) => (
								<Input {...field} type="password" autoComplete="new-password" />
							)}
						/>
						<Button type="submit" disabled={pending}>
							{pending ? <Loader className="w-4 h-4 animate-spin" /> : "Log in"}
						</Button>
					</form>
				</Form>
				<GoogleButton />
			</CardContent>
		</Card>
	);
}