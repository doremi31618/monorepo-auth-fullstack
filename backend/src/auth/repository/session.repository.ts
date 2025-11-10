import { Inject, Injectable } from '@nestjs/common';
import { type DB } from 'src/db/db';
import { schema } from 'src/db/schema';
import { lt, eq } from 'drizzle-orm';

export type CreateSession = {
    userId: number;
    sessionToken: string;
    expiresAt: Date;
}

@Injectable()
export class SessionRepository {
    constructor(
        @Inject('DB') private readonly db: DB) {}
    
    async getSessionByToken(sessionToken: string) {
        try {
            const token = await this.db.select()
                .from(schema.authModel.userSessions)
                .where(
                    eq(
                        schema.authModel.userSessions.sessionToken, 
                        sessionToken));
            return token[0] ?? null;
        }catch (error) {
            console.error('getSessionByToken failed', error);
            throw error;
        }
    }

    async createSession(session: CreateSession) {
        try {
            const [newSession] = await this.db
                .insert(schema.authModel.userSessions)
                .values({
                    id: crypto.randomUUID(),
                    userId: session.userId,
                    sessionToken: session.sessionToken,
                    expiresAt: session.expiresAt,
                })
                .returning({
                    id: schema.authModel.userSessions.id,
                    userId: schema.authModel.userSessions.userId,
                    sessionToken: schema.authModel.userSessions.sessionToken,
                    expiresAt: schema.authModel.userSessions.expiresAt,
                });
            return newSession;
        } catch (error) {
            console.error('createSession failed', error);
            throw error;
        }
    }
    async deleteSession(sessionToken: string) {
        try{
            const deletedSession = await this.db
                .delete(schema.authModel.userSessions)
                .where(
                    eq(schema.authModel.userSessions.sessionToken,
                        sessionToken
                    )
                ).returning({
                    id: schema.authModel.userSessions.id,
                    userId: schema.authModel.userSessions.userId
                });
                return deletedSession[0] ?? null;
            }catch (error) {
                console.error('deleteSession failed', error);
                throw error;
            }

        }

    async cleanupExpiredSessions() {
        try{
            console.info('cleanupExpiredSessions started');
            const deletedSessions = await this.db
            .delete(schema.authModel.userSessions)
            .where(lt(schema.authModel.userSessions.expiresAt, new Date(Date.now())))
            .returning({
                id: schema.authModel.userSessions.id,
            });
        return `clean up ${deletedSessions.length} sessions`;
        } catch (error) {
            console.error('cleanupExpiredSessions failed', error);
            throw error;
        }
    
       
    }
}
