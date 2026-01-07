import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service.js';
import { JobSchedulerPort } from './scheduling.port.js';
import { LoggerModule } from '../logger/logger.module.js';
import { DbModule } from '../db/db.module.js';
import { SchedulingRepository } from './scheduling.repository.js';
@Module({
  imports: [
    LoggerModule,
    DbModule,
  ],
  providers: [
    SchedulingService,
    SchedulingRepository,
    {
      provide: JobSchedulerPort,
      useExisting: SchedulingService,
    }
  ],
  exports: [JobSchedulerPort]
})
export class SchedulingModule { }
