import { SignInCard } from "@/components/login";
import { SignUpCard } from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Auth",
	description: "Login or sign up to continue",
};

export default async function Page() {
	const authz = await auth.api.getSession({ headers: await headers() });
	if (authz) redirect("/polls");
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<Tabs defaultValue="login" className="w-full max-w-sm">
				<TabsList className="w-full">
					<TabsTrigger className="w-full" value="login">
						Log in
					</TabsTrigger>
					<TabsTrigger className="w-full" value="signup">
						Sign up
					</TabsTrigger>
				</TabsList>
				<TabsContent value="signup">
					<SignUpCard />
				</TabsContent>
				<TabsContent value="login">
					<SignInCard />
				</TabsContent>
			</Tabs>
		</main>
	);
}
