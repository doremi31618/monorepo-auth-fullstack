<script lang="ts">
  import type { Permission } from '$lib/api/admin';

  export let allPermissions: Permission[] = [];
  export let selectedPermissionIds: string[] = [];
  export let onChange: (selectedIds: string[]) => void;

  // Group permissions by module
  $: groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  function togglePermission(id: string) {
    if (selectedPermissionIds.includes(id)) {
      selectedPermissionIds = selectedPermissionIds.filter(p => p !== id);
    } else {
      selectedPermissionIds = [...selectedPermissionIds, id];
    }
    onChange(selectedPermissionIds);
  }

  function toggleModule(moduleName: string) {
    const modulePerms = groupedPermissions[moduleName].map((p: any) => p.id);
    const allSelected = modulePerms.every((id: string) => selectedPermissionIds.includes(id));
    
    if (allSelected) {
      selectedPermissionIds = selectedPermissionIds.filter(id => !modulePerms.includes(id));
    } else {
      selectedPermissionIds = [...new Set([...selectedPermissionIds, ...modulePerms])];
    }
    onChange(selectedPermissionIds);
  }
</script>

<div class="space-y-6">
  {#each Object.entries(groupedPermissions) as [moduleName, permissions] (moduleName)}
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div class="flex items-center justify-between mb-3 border-b pb-2">
        <h3 class="text-sm font-bold uppercase text-gray-700">{moduleName}</h3>
        <button 
          on:click={() => toggleModule(moduleName)}
          class="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Toggle All
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {#each permissions as perm}
          <label class="flex items-start space-x-2 cursor-pointer p-2 hover:bg-white rounded">
            <input 
              type="checkbox" 
              checked={selectedPermissionIds.includes(perm.id)}
              on:change={() => togglePermission(perm.id)}
              class="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900">{perm.action}</span>
              <span class="text-xs text-gray-500">{perm.description}</span>
            </div>
          </label>
        {/each}
      </div>
    </div>
  {/each}
</div>
