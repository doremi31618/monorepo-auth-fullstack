
import { Injectable } from '@nestjs/common';
import { eq, and, ilike, or } from 'drizzle-orm';
import { BaseRepository } from '../../infra/db/base.repository.js';
import { roles, permissions, rolePermissions, userRoles } from './access-control.schema.js';
import { users } from '../user/user.schema.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccessControlRepository extends BaseRepository {

    // Roles
    async getRoles() {
        return this.db.query.roles.findMany({
            with: {
                rolePermissions: {
                    with: {
                        permission: true
                    }
                }
            }
        });
    }

    async findRoleById(id: string) {
        return this.db.query.roles.findFirst({
            where: eq(roles.id, id)
        });
    }

    async createRole(role: typeof roles.$inferInsert) {
        return this.db.insert(roles).values(role).returning();
    }

    async updateRole(id: string, data: Partial<typeof roles.$inferInsert>) {
        return this.db.update(roles).set(data).where(eq(roles.id, id)).returning();
    }

    async deleteRole(id: string) {
        return this.db.delete(roles).where(eq(roles.id, id)).returning();
    }

    // Permissions
    async getPermissions() {
        return this.db.select().from(permissions);
    }

    async createPermissions(perms: (typeof permissions.$inferInsert)[]) {
        return this.db.insert(permissions).values(perms).onConflictDoNothing().returning();
    }

    // Relations
    async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
        if (permissionIds.length === 0) return [];
        const values = permissionIds.map(pid => ({ roleId, permissionId: pid }));
        return this.db.insert(rolePermissions).values(values).onConflictDoNothing().returning();
    }

    async removePermissionsFromRole(roleId: string) {
        return this.db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    }

    async assignRoleToUser(userId: number, roleId: string) {
        return this.db.insert(userRoles).values({ userId, roleId }).onConflictDoNothing().returning();
    }

    async removeRoleFromUser(userId: number, roleId: string) {
        return this.db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
    }

    async getUserPermissions(userId: number): Promise<string[]> {
        const result = await this.db
            .select({ permissionId: rolePermissions.permissionId })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
            .where(eq(userRoles.userId, userId));

        return result.map(r => r.permissionId);
    }

    async findUserByEmail(email: string) {
        return this.db.query.users.findFirst({
            where: eq(users.email, email)
        });
    }

    async findUserById(id: number) {
        return this.db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                userRoles: {
                    with: {
                        role: true
                    }
                }
            }
        });
    }

    async createUser(data: any) {
        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.db.insert(users).values(data).returning();
    }



    async getUserRoles(userId: number) {
        const result = await this.db.query.userRoles.findMany({
            where: eq(userRoles.userId, userId),
            with: {
                role: true
            }
        });
        return result.map(ur => ur.role);
    }

    async getUsers(options?: { page?: number; limit?: number; search?: string }) {
        const whereClause = options?.search
            ? or(ilike(users.name, `%${options.search}%`), ilike(users.email, `%${options.search}%`))
            : undefined;

        // Basic implementation for now, will enhance later
        // Note: total count calculation is missing for proper pagination metadata, 
        // strictly following current simplified implementation pattern.
        return this.db.query.users.findMany({
            where: whereClause,
            with: {
                userRoles: {
                    with: {
                        role: true
                    }
                }
            },
            limit: options?.limit,
            offset: options?.page && options?.limit ? (options.page - 1) * options.limit : undefined
        });
    }
    async updateUser(id: number, data: { name?: string; email?: string }) {
        return this.db.update(users).set(data).where(eq(users.id, id)).returning();
    }
}
