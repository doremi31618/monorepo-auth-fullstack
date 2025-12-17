import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module.js';
import { MailModule } from './mail/mail.module.js';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [DbModule, MailModule, LoggerModule],
    exports: [DbModule, MailModule]
})
export class InfraModule { }
