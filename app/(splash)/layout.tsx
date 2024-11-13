import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export default function SplashLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<header className="sticky top-0 flex bg-background/50 backdrop-blur-sm gap-4 p-4">
				<div className="flex-1">
					<Link href={"/"}>
						<Button variant={"ghost"}>Pollster</Button>
					</Link>
				</div>
				<div className="flex-none">
					<Link className="btn btn-link" href={"/dashboard"}>
						<Button variant={"link"}>Dashboard</Button>
					</Link>
				</div>
			</header>
			<main>{children}</main>
		</>
	);
}
