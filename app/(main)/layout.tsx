import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		template: "&s | Dashboard",
		default: "Dashboard",
	},
};

export default async function MainLayout({
	children,
}: { children: ReactNode }) {
	const authz = await auth.api.getSession({
		headers: await headers(),
	});
	if (!authz) {
		redirect("/auth");
	}
	return <main>{children}</main>;
}
