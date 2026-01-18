
import { Module } from '@nestjs/common';
import { AccessControlController } from './access-control.controller.js';
import { AccessControlService } from './access-control.service.js';
import { AccessControlRepository } from './access-control.repository.js';
import { LoggerModule } from '../../infra/logger/logger.module.js';
import { DbModule } from '../../infra/db/db.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { UserService } from '../user/user.service.js';
import { UserModule } from '../user/user.module.js';
// impoer {UserModule}

@Module({
    imports: [DbModule, LoggerModule, AuthModule, UserModule],
    controllers: [AccessControlController],
    providers: [AccessControlService,
        {
            provide: 'IAccessControlRepository',
            useClass: AccessControlRepository
        },
        {
            provide: 'IUserService',
            useClass: UserService
        }
        , AccessControlRepository],
    exports: [AccessControlService]
})
export class AccessControlModule { }
