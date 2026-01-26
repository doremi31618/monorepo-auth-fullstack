export declare const PermissionSchema: {
    readonly Users: {
        readonly Read: "users.read";
        readonly Create: "users.create";
        readonly Update: "users.update";
        readonly Delete: "users.delete";
        readonly ManageRoles: "users.roles.update";
    };
    readonly Roles: {
        readonly Read: "roles.read";
        readonly Create: "roles.create";
        readonly Update: "roles.update";
        readonly Delete: "roles.delete";
        readonly ManagePermissions: "roles.permissions.update";
    };
    readonly Permissions: {
        readonly Read: "permissions.read";
    };
};
export type PermissionCode = string;
//# sourceMappingURL=permissions.d.ts.map