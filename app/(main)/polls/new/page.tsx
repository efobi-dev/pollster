import { NewContest } from "@/components/polls/new";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function Page() {
	return (
		<>
			<NewContest />
		</>
	);
}
