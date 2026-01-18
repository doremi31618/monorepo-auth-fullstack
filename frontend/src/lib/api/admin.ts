
import { httpClient } from '../utils';

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
}

export interface Permission {
    id: string;
    module: string;
    action: string;
    description: string;
}

export interface UserWithRoles {
    id: number;
    email: string;
    name: string;
    userRoles: {
        role: Role;
    }[];
}

export async function getRoles() {
    return await httpClient.get<Role[]>('/admin/roles');
}

export async function createRole(role: { name: string; description?: string; id?: string }) {
    return await httpClient.post<Role>('/admin/roles', role);
}

export async function updateRole(id: string, role: { name?: string; description?: string }) {
    return await httpClient.put<Role>(`/admin/roles/${id}`, role);
}

export async function deleteRole(id: string) {
    return await httpClient.delete(`/admin/roles/${id}`);
}

export async function getPermissions() {
    return await httpClient.get<Permission[]>('/admin/permissions');
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
    return await httpClient.post<{ success: boolean }>(`/admin/roles/${roleId}/permissions`, { permissionIds });
}

export async function assignRoleToUser(userId: number, roleId: string) {
    return await httpClient.post<{ success: boolean }>(`/admin/users/${userId}/roles`, { roleId });
}

// User methods for admin
export async function getUsers(params?: any) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return await httpClient.get<UserWithRoles[]>('/admin/users' + query);
}

export async function getMe() {
    return await httpClient.get<UserWithRoles>('/admin/me');
}

export async function updateUser(userId: number, data: { name?: string; email?: string }) {
    return await httpClient.put<any>(`/admin/users/${userId}`, data);
}
