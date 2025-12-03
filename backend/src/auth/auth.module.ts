import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { SessionRepository } from 'src/auth/repository/session.repository';
import { SessionCleanupService } from 'src/auth/session-cleanup.service';
import { DbModule } from 'src/db/db.module';
import { GoogleService } from './google/google.service';
import { GoogleController } from './google/google.controller';
import { MailModule } from 'src/mail/mail.module';
@Module({
	imports: [UserModule, DbModule, MailModule],
	controllers: [AuthController, GoogleController],
	providers: [
		AuthService,
		SessionCleanupService,
		SessionRepository,
		DbModule,
		GoogleService
	],
	exports: [AuthService, SessionCleanupService, SessionRepository]
})
export class AuthModule {}
