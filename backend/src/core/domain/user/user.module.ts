import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { DbModule } from '../../infra/db/db.module.js';
import { IUserService } from './user.interface.js';

@Module({
	imports: [DbModule],
	providers: [
		UserService, 
		UserRepository, 
		{
			provide: IUserService,
			useClass: UserService,
		},
		DbModule],
	exports: [UserService, UserRepository, IUserService]
})
export class UserModule { }
