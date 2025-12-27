import { Inject } from "@nestjs/common";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";


export type DrizzleDB = NodePgDatabase<typeof schema>;

export abstract class BaseRepository {
    constructor(
        @Inject('DB') protected readonly db: DrizzleDB,
    ) {}
}
