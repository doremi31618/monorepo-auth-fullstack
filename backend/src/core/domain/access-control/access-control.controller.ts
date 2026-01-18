
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AccessControlService } from './access-control.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RBACGuard } from './rbac.guard.js';
import { RequirePermissions } from './permissions.decorator.js';

@Controller('admin')
@UseGuards(AuthGuard, RBACGuard)
export class AccessControlController {
    constructor(private readonly service: AccessControlService) { }

    @Get('roles')
    @RequirePermissions('roles.read')
    async getRoles() {
        return this.service.getRoles();
    }

    @Post('roles')
    @RequirePermissions('roles.create')
    async createRole(@Body() body: { name: string; description?: string; id?: string }) {
        return this.service.createRole(body.name, body.description, body.id);
    }

    @Put('roles/:id')
    @RequirePermissions('roles.update')
    async updateRole(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
        return this.service.updateRole(id, body);
    }

    @Delete('roles/:id')
    @RequirePermissions('roles.delete')
    async deleteRole(@Param('id') id: string) {
        return this.service.deleteRole(id);
    }

    @Get('permissions')
    @RequirePermissions('permissions.read')
    async getPermissions() {
        return this.service.getPermissions();
    }

    @Post('roles/:id/permissions')
    @RequirePermissions('roles.permissions.update')
    async updateRolePermissions(@Param('id') id: string, @Body() body: { permissionIds: string[] }) {
        return this.service.updateRolePermissions(id, body.permissionIds);
    }

    @Post('users/:userId/roles')
    @RequirePermissions('users.roles.update')
    async assignRoleToUser(@Param('userId') userId: string, @Body() body: { roleId: string }) {
        return this.service.assignRoleToUser(parseInt(userId), body.roleId);
    }

    @Get('users')
    @RequirePermissions('users.read')
    async getUsers() {
        return this.service.getUsers();
    }

    @Put('users/:userId')
    @RequirePermissions('users.update')
    async updateUser(@Param('userId') userId: string, @Body() body: { name?: string; email?: string }) {
        return this.service.updateUser(parseInt(userId), body);
    }

    @Get('me')
    async getMe(@Req() req) {
        return this.service.getUserProfile(req.user.id);
    }
}
