import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AccessControlModule } from './access-control/access-control.module.js';

@Module({
    imports: [UserModule, AuthModule, AccessControlModule],
    exports: [UserModule, AuthModule, AccessControlModule]
})
export class DomainModule { }
