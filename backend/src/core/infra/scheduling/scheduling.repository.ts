
import { and, eq } from "drizzle-orm";
import { BaseRepository } from "../db/base.repository.js";
import { type Job, type JobStatus } from "./scheduling.port.js";
import { jobs } from "./scheduling.schema.js";
export class SchedulingRepository extends BaseRepository {
    createJob(job: Job) {
        return this.db.insert(jobs).values(job);
    }
    updateJobStatus(name: string, runAt: Date, status: JobStatus) {
        return this.db.update(jobs).set({ status })
            .where(
                and(
                    eq(jobs.name, name),
                    eq(jobs.runAt, runAt)
                )
            );
    }
    deleteJob(name: string, runAt: Date) {
        return this.db.delete(jobs)
            .where(
                and(
                    eq(jobs.name, name),
                    eq(jobs.runAt, runAt)
                )
            );
    }
    getJob(name: string, runAt: Date) {
        return this.db.select().from(jobs)
            .where(
                and(
                    eq(jobs.name, name),
                    eq(jobs.runAt, runAt)
                )
            );
    }
    getJobs() {
        return this.db.select().from(jobs);
    }
}
