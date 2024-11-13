import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
	render,
} from "@react-email/components";
import * as React from "react";

interface InviteUserEmailProps {
	invitedUserEmail: string;
	inviterUsername: string;
	inviterEmail: string;
	contestName: string;
	inviteLink: string;
	inviterIp: string;
}

export const InviteUserEmail = ({
	invitedUserEmail,
	inviterUsername,
	inviterEmail,
	contestName,
	inviteLink,
	inviterIp,
}: InviteUserEmailProps) => {
	const previewText = `Join ${inviterUsername} on PollSter`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Join <strong>{inviterUsername}</strong> as candidate on{" "}
							<strong>PollSter</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello {invitedUserEmail},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							<strong>{inviterUsername}</strong> (
							<Link
								href={`mailto:${inviterEmail}`}
								className="text-blue-600 no-underline"
							>
								{inviterEmail}
							</Link>
							) has invited you to the <strong>{contestName}</strong> as a
							candidate on <strong>PollSter</strong>.
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={inviteLink}
							>
								Participate now
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link href={inviteLink} className="text-blue-600 no-underline">
								{inviteLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							This invitation was intended for{" "}
							<span className="text-black">{invitedUserEmail}</span>. This
							invite was sent from{" "}
							<span className="text-black">{inviterIp}</span> .If you were not
							expecting this invitation, you can ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export const inviteUserHtml = async ({
	inviterIp,
	inviteLink,
	inviterEmail,
	inviterUsername,
	invitedUserEmail,
	contestName,
}: InviteUserEmailProps) => {
	const emailBody = await render(
		<InviteUserEmail
			invitedUserEmail={invitedUserEmail}
			inviterUsername={inviterUsername}
			inviterEmail={inviterEmail}
			contestName={contestName}
			inviteLink={inviteLink}
			inviterIp={inviterIp}
		/>,
	);
	return emailBody;
};
