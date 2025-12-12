import { z } from 'zod';

//system env configuration schema
export const envSchema = z.object({
	//App 
	PORT: z.string().optional().default('3333'),
    NODE_ENV: z.enum(['dev', 'prd']).optional().default('dev'),
	API_PROTOCOL: z.string().optional().default('http'),
	API_HOST: z.string().optional().default('localhost'),

    //Connecting Info
	HOST_URL: z.url().optional().default('http://localhost:3333'),//compute if missing
    FRONTEND_URL: z.url().optional().default('http://localhost:5173'),//compute if missing
	DATABASE_URL: z.string().optional().default('postgres://postgres:postgres@localhost:5432/postgres'),

	//Mail
	SMTP_HOST: z.string().nonempty(),
	SMTP_PORT: z.coerce.number().default(465),
	SMTP_USER: z.string().nonempty(),
	SMTP_PASS: z.string().nonempty(),
	SMTP_FROM: z.string().nonempty(),

	//Google sso
	GOOGLE_SSO_CLIENT_ID: z.string().nonempty(),
	GOOGLE_SSO_CLIENT_SECRET: z.string().nonempty(),

})

export type Env = z.infer<typeof envSchema>;

//safe parase system env configuration
export function validate(config: Record<string, unknown>) {

	const result = envSchema.safeParse(config);
	if (!result.success) {
		throw new Error(`Invalid environment variables: ${result.error.message}`);
	}
	return result.data;
}