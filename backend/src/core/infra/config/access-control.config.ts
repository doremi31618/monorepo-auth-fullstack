import { PermissionSchema } from '@share/contract';

// Derive permissions from schema
const permissions = [
    // Users
    { id: PermissionSchema.Users.Read, module: 'users', action: 'read', description: 'View users' },
    { id: PermissionSchema.Users.Create, module: 'users', action: 'create', description: 'Create users' },
    { id: PermissionSchema.Users.Update, module: 'users', action: 'update', description: 'Update users' },
    { id: PermissionSchema.Users.Delete, module: 'users', action: 'delete', description: 'Delete users' },
    { id: PermissionSchema.Users.ManageRoles, module: 'users', action: 'update_roles', description: 'Update user roles' },

    // Roles
    { id: PermissionSchema.Roles.Read, module: 'roles', action: 'read', description: 'View roles' },
    { id: PermissionSchema.Roles.Create, module: 'roles', action: 'create', description: 'Create roles' },
    { id: PermissionSchema.Roles.Update, module: 'roles', action: 'update', description: 'Update roles' },
    { id: PermissionSchema.Roles.Delete, module: 'roles', action: 'delete', description: 'Delete roles' },
    { id: PermissionSchema.Roles.ManagePermissions, module: 'roles', action: 'update_permissions', description: 'Update role permissions' },

    // Permissions
    { id: PermissionSchema.Permissions.Read, module: 'permissions', action: 'read', description: 'View permissions' },
];

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
    permissions,
    // Map roles to permissions
    rolePermissions: {
        'admin': ['*'] as string[], // '*' means all permissions
        'user': [PermissionSchema.Users.Read] as string[],
    },
    rootAdmin: {
        email: 'admin@system.com',
        name: 'System Admin',
        password: 'admin123'
    }
};
