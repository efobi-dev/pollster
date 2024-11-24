"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h1 className="text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
						Poll<span className="text-blue-600">Ster</span>
						<span className="block text-3xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
							Modern Voting Made Simple
						</span>
					</h1>
					<p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
						Create custom polls, manage candidates, and collect votes in
						real-time. The perfect platform for organizing fair and transparent
						voting experiences.
					</p>
					<div className="flex gap-4 justify-center mb-20">
						<Link href="/polls">
							<Button
								size="lg"
								className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all"
							>
								Get Started Free
							</Button>
						</Link>
					</div>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8 mb-20">
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<Card className="h-full hover:shadow-lg transition-shadow">
							<CardHeader>
								<h3 className="text-xl font-bold text-blue-600">
									Custom Polls
								</h3>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600">
									Design and customize your voting polls with unlimited options
									and settings
								</p>
							</CardContent>
						</Card>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<Card className="h-full hover:shadow-lg transition-shadow">
							<CardHeader>
								<h3 className="text-xl font-bold text-blue-600">
									Real-Time Results
								</h3>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600">
									Monitor voting progress and results as they happen in
									real-time
								</p>
							</CardContent>
						</Card>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<Card className="h-full hover:shadow-lg transition-shadow">
							<CardHeader>
								<h3 className="text-xl font-bold text-blue-600">
									Secure Voting
								</h3>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600">
									Anonymous and weighted voting options with robust security
									measures
								</p>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				<div className="text-center">
					<h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
						How It Works
					</h2>
					<div className="grid md:grid-cols-4 gap-8">
						{[
							{ step: 1, text: "Create your custom poll" },
							{ step: 2, text: "Invite candidates" },
							{ step: 3, text: "Share voting links" },
							{ step: 4, text: "Track results live" },
						].map((item, index) => (
							<motion.div
								key={item.step}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="group"
							>
								<Card className="h-full hover:shadow-lg transition-all group-hover:border-blue-600">
									<CardContent className="pt-6">
										<div className="text-3xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform">
											{item.step}
										</div>
										<p className="text-slate-600 font-medium">{item.text}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
