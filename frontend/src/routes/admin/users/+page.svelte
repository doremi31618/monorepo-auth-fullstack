
<script lang="ts">
  import { onMount } from 'svelte';
  import * as api from '$lib/api/admin';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let users: any[] = [];
  let roles: api.Role[] = [];
  
  // Modals state
  let showEditModal = false;
  let currentUser: any = null;
  // let selectedRoleId = ''; // Merged into editForm or handled in same modal
  
  // Edit User Form State
  let editForm = {
      name: '',
      email: '',
      roleId: ''
  };
  
  // Search & Pagination State
  let searchQuery = '';
  let currentPage = 1;
  let pageSize = 10;
  let totalUsers = 0;

  $: currentPage = Number($page.url.searchParams.get('page')) || 1;
  $: searchQuery = $page.url.searchParams.get('q') || '';

  async function loadUsers() {
    const params = {
        page: currentPage,
        limit: pageSize,
        q: searchQuery // This now works with backend search
    };
    const response = await api.getUsers(params);
    if (response && (response as any).meta) {
         users = (response as any).data || [];
         totalUsers = (response as any).meta.total || 0;
    } else {
         users = response.data || []; 
         totalUsers = users.length;
    }
  }
  
  $: {
      if (currentPage || searchQuery) {
          loadUsers();
      }
  }

  function handleSearch() {
      goto(`?page=1&q=${searchQuery}`);
  }

  function changePage(newPage: number) {
      if (newPage < 1) return;
      const totalPages = Math.ceil(totalUsers / pageSize);
      if (totalPages > 0 && newPage > totalPages) return;
      goto(`?page=${newPage}&q=${searchQuery}`);
  }

  onMount(async () => {
    const rolesResponse = await api.getRoles();
    roles = rolesResponse.data || [];
  });

  function openEditModal(user: any) {
      currentUser = user;
      editForm = {
          name: user.name,
          email: user.email,
          roleId: user.userRoles?.[0]?.role?.id || ''
      };
      showEditModal = true;
  }

  async function saveUserChanges() {
      if (currentUser && editForm.name && editForm.email) {
          // 1. Update Profile
          await api.updateUser(currentUser.id, { name: editForm.name, email: editForm.email });
          
          // 2. Update Role if changed
          const currentRoleId = currentUser.userRoles?.[0]?.role?.id || '';
          if (editForm.roleId && editForm.roleId !== currentRoleId) {
             await api.assignRoleToUser(currentUser.id, editForm.roleId);
          }

          await loadUsers();
          showEditModal = false;
      }
  }
</script>

<div class="p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
    
    <div class="flex items-center space-x-2">
        <input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Search users..." 
            class="border p-2 rounded w-64"
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button on:click={handleSearch} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Search
        </button>
    </div>
  </div>

  <div class="bg-white shadow rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each users as user}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {#if user.userRoles && user.userRoles.length > 0}
              {#each user.userRoles as ur}
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1">
                  {ur.role.name}
                </span>
              {/each}
            {:else}
              <span class="text-gray-400 italic">No Role</span>
            {/if}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button on:click={() => openEditModal(user)} class="text-blue-600 hover:text-blue-900">Manage</button>
          </td>
        </tr>
        {/each}
        {#if users.length === 0}
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">No users found.</td>
            </tr>
        {/if}
      </tbody>
    </table>
    
    <!-- Pagination -->
    {#if totalUsers > 0}
    <div class="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
        <span class="text-sm text-gray-700">
            Page {currentPage} of {Math.ceil(totalUsers / pageSize)}
        </span>
        <div class="space-x-2">
            <button 
                on:click={() => changePage(currentPage - 1)} 
                disabled={currentPage === 1}
                class="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
            >
                Previous
            </button>
            <button 
                on:click={() => changePage(currentPage + 1)} 
                disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                class="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
            >
                Next
            </button>
        </div>
    </div>
    {/if}
  </div>

  <!-- Unified Manage User Modal -->
  {#if showEditModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4">Manage User: {currentUser.name}</h2>
        
        <div class="space-y-4 mb-6">
            <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" bind:value={editForm.name} class="mt-1 w-full border p-2 rounded" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" bind:value={editForm.email} class="mt-1 w-full border p-2 rounded" />
            </div>
             <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <select bind:value={editForm.roleId} class="mt-1 w-full border p-2 rounded">
                <option value="" disabled>Select a role</option>
                {#each roles as role}
                    <option value={role.id}>{role.name}</option>
                {/each}
                </select>
            </div>
        </div>

         <div class="flex justify-end space-x-2">
           <button on:click={() => showEditModal = false} class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
           <button on:click={saveUserChanges} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
         </div>
      </div>
    </div>
  {/if}
</div>
