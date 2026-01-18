<script lang="ts">
  import { onMount } from 'svelte';
  import * as api from '$lib/api/admin';
  import PermissionMatrix from '../components/PermissionMatrix.svelte';

  let roles: (api.Role & { rolePermissions?: { permission: api.Permission }[] })[] = [];
  let filteredRoles: (api.Role & { rolePermissions?: { permission: api.Permission }[] })[] = [];
  
  let showRoleModal = false;
  let currentRole: Partial<api.Role> = { name: '', description: '' };
  
  // Permissions state
  let allPermissions: api.Permission[] = [];
  let selectedPermissionIds: string[] = [];
  // For create/edit flow
  let isCreating = false;
  // Search
  let searchQuery = '';

  onMount(async () => {
    await loadRoles();
    const permResponse = await api.getPermissions();
    allPermissions = permResponse.data || [];
  });

  async function loadRoles() {
    const response = await api.getRoles();
    roles = response.data || [];
    filterRoles();
  }

  function filterRoles() {
      if (!searchQuery) {
          filteredRoles = [...roles];
      } else {
          const lowerQuery = searchQuery.toLowerCase();
          filteredRoles = roles.filter(r => 
              r.name.toLowerCase().includes(lowerQuery) || 
              (r.description && r.description.toLowerCase().includes(lowerQuery))
          );
      }
  }

  $: searchQuery, filterRoles();

  function openCreateModal() {
    currentRole = { name: '', description: '' };
    selectedPermissionIds = [];
    isCreating = true;
    showRoleModal = true;
  }

  function openEditModal(role: any) {
    currentRole = { ...role };
    isCreating = false;
    // Pre-fill permissions from the role object (populated by backend)
    selectedPermissionIds = role.rolePermissions?.map((rp: any) => rp.permission.id) || [];
    showRoleModal = true;
  }

  async function saveRole() {
    let savedRole: any;
    if (currentRole.id) {
      const res = await api.updateRole(currentRole.id, currentRole);
      savedRole = res.data;
    } else {
      const res = await api.createRole(currentRole as any);
      savedRole = res.data;
    }

    // Assign selected permissions
    if (savedRole && savedRole.id) {
        await api.updateRolePermissions(savedRole.id, selectedPermissionIds);
    }

    await loadRoles();
    showRoleModal = false;
  }

  async function deleteRole(id: string) {
    if (confirm('Are you sure?')) {
      await api.deleteRole(id);
      await loadRoles();
    }
  }
</script>

<div class="p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Role Management</h1>
    
    <div class="flex items-center space-x-2">
        <input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Search roles..." 
            class="border p-2 rounded w-64"
        />
        <button on:click={openCreateModal} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Role</button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredRoles as role}
      <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold text-gray-900">{role.name}</h3>
          {#if role.isSystem}
            <span class="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">System</span>
          {/if}
        </div>
        <p class="text-gray-500 text-sm mb-4">{role.description || 'No description'}</p>
        <div class="flex space-x-2">
          <button on:click={() => openEditModal(role)} class="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm">Edit & Permissions</button>
          <button on:click={() => deleteRole(role.id)} class="text-red-500 px-3 py-1 hover:text-red-700 text-sm">Delete</button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Unified Role Modal -->
  {#if showRoleModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 class="text-xl font-bold mb-4">{currentRole.id ? 'Edit Role' : 'Create Role'}</h2>
        
        <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" placeholder="Role Name" bind:value={currentRole.name} class="mt-1 w-full border p-2 rounded" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea placeholder="Description" bind:value={currentRole.description} class="mt-1 w-full border p-2 rounded h-[42px]"></textarea>
            </div>
        </div>

        <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-2">Permissions</h3>
                <PermissionMatrix 
                allPermissions={allPermissions}
                selectedPermissionIds={selectedPermissionIds}
                onChange={(ids) => selectedPermissionIds = ids}
            />
        </div>

         <div class="flex justify-end space-x-2 mt-6">
           <button on:click={() => showRoleModal = false} class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
           <button on:click={saveRole} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
         </div>
      </div>
    </div>
  {/if}
</div>
