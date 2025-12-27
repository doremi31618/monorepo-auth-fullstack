import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
// import { type DB } from '../../infra/db/db.js';
import { schema } from '../../infra/db/schema.js';
import { type UserEntity } from './user.interface.js';
import { type CreateUserDto } from '@share/contract';
import { BaseRepository } from '../../infra/db/base.repository.js';
// import { type User, type NewUser } from './user.schema.js';


@Injectable()
export class UserRepository extends BaseRepository {
	// constructor(@Inject('DB') private readonly db: DB) { }
	async getUserById(id: number): Promise<UserEntity | null> {
		const user = await this.db
			.select({
				id: schema.users.id,
				email: schema.users.email,
				name: schema.users.name,
				password: schema.users.password,
				createdAt: schema.users.createdAt,
				updatedAt: schema.users.updatedAt
			})
			.from(schema.users)
			.where(eq(schema.users.id, id));
		return user[0] ?? null;
	}
	async getUserByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.db
			.select({
				id: schema.users.id,
				email: schema.users.email,
				name: schema.users.name,
				password: schema.users.password,
				createdAt: schema.users.createdAt,
				updatedAt: schema.users.updatedAt
			})
			.from(schema.users)
			.where(eq(schema.users.email, email));

		return user[0] ?? null;
	}

	async createUser(user: CreateUserDto): Promise<UserEntity> {
		const [newUser] = await this.db
			.insert(schema.users)
			.values({
				email: user.email,
				name: user.name,
				password: user.password
			})
			.returning({
				id: schema.users.id,
				email: schema.users.email,
				name: schema.users.name,
				password: schema.users.password,
				createdAt: schema.users.createdAt,
				updatedAt: schema.users.updatedAt
			});
		return newUser;
	}

	async updatePassword(userId: number, hashedPassword: string) {
		const [updated] = await this.db
			.update(schema.users)
			.set({
				password: hashedPassword,
				updatedAt: new Date()
			})
			.where(eq(schema.users.id, userId))
			.returning({
				id: schema.users.id
			});
		return updated ?? null;
	}
}
