import { z } from "zod";

const envSchema = z.object({
	ROVER_HOST: z.string().default("https://api.getrover.com"),
	ROVER_API_KEY: z.string().describe("Your Rover API key"),
});
type EnvSchema = z.infer<typeof envSchema>;

export function loadEnv():
	| { ok: true; data: EnvSchema }
	| { ok: false; error: z.ZodError<EnvSchema> } {
	const result = envSchema.safeParse(process.env);
	if (!result.success) {
		return { ok: false, error: result.error };
	}

	return { ok: true, data: result.data };
}

export function log(message: string, data?: Record<string, unknown>) {
	const logLine = [
		new Date().toISOString(),
		message,
		data ? JSON.stringify(data) : null,
	]
		.filter(Boolean)
		.join(" ");
	console.error(logLine);
}
