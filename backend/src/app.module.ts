import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './core/core.module.js';
import appConfig from './core/infra/config/app.config.js';
import { validate } from './core/infra/config/env.validation.js';

// const env = validate(process.env);
@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({ 
			isGlobal: true, 
			validate,
			load: [appConfig] }),
		CoreModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule { }
