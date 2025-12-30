import { Injectable } from '@nestjs/common';
import { JobSchedulerPort } from './scheduling.port.js';
import { SchedulingRepository } from './scheduling.repository.js';
@Injectable()
export class SchedulingService implements JobSchedulerPort {
    constructor(
        private readonly repository: SchedulingRepository
    ) { }

    schedule(name: string, data: any, runAt: Date): Promise<void> {
        this.repository.createJob({
            name,
            data,
            runAt,
        })
        return Promise.resolve();
    }
    registerHandler(name: string, handler: (job: Job) => Promise<void>): void {
        throw new Error('Method not implemented.');
    }
}
