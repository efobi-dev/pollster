export async function GET(): Promise<Response> {
	try {
		return new Response(null, { status: 200 });
	} catch (error) {
		return new Response(null, { status: 500 });
	}
}
