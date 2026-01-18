export const ACCESS_CONTROL_CONFIG = {
    roles: [
        {
            id: 'admin',
            name: 'Administrator',
            description: 'System Administrator with full access',
            isSystem: true,
        },
        {
            id: 'user',
            name: 'User',
            description: 'Standard user',
            isSystem: true,
        },
    ],
    permissions: [
        // User Management
        { id: 'users.read', module: 'users', action: 'read', description: 'View users' },
        { id: 'users.create', module: 'users', action: 'create', description: 'Create users' },
        { id: 'users.update', module: 'users', action: 'update', description: 'Update users' },
        { id: 'users.delete', module: 'users', action: 'delete', description: 'Delete users' },

        // Role Management
        { id: 'roles.read', module: 'roles', action: 'read', description: 'View roles' },
        { id: 'roles.create', module: 'roles', action: 'create', description: 'Create roles' },
        { id: 'roles.update', module: 'roles', action: 'update', description: 'Update roles' },
        { id: 'roles.delete', module: 'roles', action: 'delete', description: 'Delete roles' },

        // Extended Permissions
        { id: 'roles.permissions.update', module: 'roles', action: 'update_permissions', description: 'Update role permissions' },
        { id: 'users.roles.update', module: 'users', action: 'update_roles', description: 'Update user roles' },
        { id: 'permissions.read', module: 'permissions', action: 'read', description: 'View permissions' },
    ],
    // Map roles to permissions
    rolePermissions: {
        'admin': ['*'], // '*' means all permissions
        'user': ['users.read'],
    },
    rootAdmin: {
        email: 'admin@system.com',
        name: 'System Admin',
        password: 'admin123'
    }
};
