import { registerAs } from "@nestjs/config";

export type MailConfig = {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
}

export default registerAs('mail', ():MailConfig => {
    return {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        from: process.env.MAIL_FROM
    }
})