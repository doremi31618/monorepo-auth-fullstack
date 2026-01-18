
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import * as api from '$lib/api/admin';
  import { appRoutePath } from '$lib/config/route';

  let isCollapsed = false;
  let user: api.UserWithRoles | null = null;
  let isLoading = true;

  const menuItems = [
    { label: 'Dashboard', href: appRoutePath.admin.dashboard, icon: 'dashboard' },
    { label: 'Users', href: appRoutePath.admin.users, icon: 'users' },
    { label: 'Roles', href: appRoutePath.admin.roles, icon: 'shield' },
  ];

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }

  async function handleLogout() {
    try {
      // Assuming generic auth api exists in separate module but not imported here
      // For now, simple redirect
      goto(appRoutePath.auth.login);
    } catch (error) {
      console.error('Logout failed', error);
      goto(appRoutePath.auth.login);
    }
  }

  onMount(async () => {
    try {
      const response = await api.getMe();
      user = response.data ?? null;
      if (!user) {
         throw new Error('Not authenticated');
      }
      
      const hasAdminRole = user.userRoles?.some(ur => ur.role.name === 'Administrator' || ur.role.id === 'admin');
      
      if (!hasAdminRole) {
          // Check for permissions if role check fails
          // const perms = await api.getMyPermissions(); // If we had this
          console.error('User is not an admin', user);
          alert('You do not have permission to access the admin panel.');
          goto(appRoutePath.base); // Redirect to home
      }
    } catch (e) {
      console.error('Admin Guard Failed', e);
      goto(appRoutePath.auth.login);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
    <div class="flex h-screen items-center justify-center">
        <div class="text-gray-500">Loading Admin Panel...</div>
    </div>
{:else}
<div class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside 
    class="bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col"
    class:w-64={!isCollapsed}
    class:w-20={isCollapsed}
  >
    <div class="p-4 border-b flex justify-between items-center h-16">
      {#if !isCollapsed}
        <h1 class="text-xl font-bold text-gray-800 truncate">Admin Panel</h1>
      {/if}
      <button 
        on:click={toggleSidebar}
        class="p-1 rounded hover:bg-gray-100 text-gray-500"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {#if isCollapsed}
            <span>&raquo;</span>
        {:else}
            <span>&laquo;</span>
        {/if}
      </button>
    </div>
    <nav class="p-4 flex-1 overflow-y-auto">
      <ul class="space-y-2">
        {#each menuItems as item}
          <li>
            <a
              href={item.href}
              class="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200
                     {$page.url.pathname === item.href ? 'bg-gray-200 font-semibold' : ''}
                     {isCollapsed ? 'justify-center' : ''}"
              title={isCollapsed ? item.label : ''}
            >
              <!-- Icon placeholder (using generic symbols or Lucide if available) -->
              <span class="text-xl leading-none">
                 {#if item.icon === 'dashboard'} &#127968;
                 {:else if item.icon === 'users'} &#128100;
                 {:else if item.icon === 'shield'} &#128737;
                 {/if}
              </span>
              
              {#if !isCollapsed}
                <span class="ml-3 truncate">{item.label}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    
    <!-- Logout in Sidebar Footer if collapsed, or just relying on header -->
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Header -->
    <header class="bg-white shadow-sm p-4 flex justify-between items-center z-10 h-16">
      <h2 class="text-lg font-semibold text-gray-700 truncate ml-2">
        {menuItems.find(i => i.href === $page.url.pathname)?.label || 'Admin'}
      </h2>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600 hidden sm:inline">Admin User</span>
        <button 
            on:click={handleLogout}
            class="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
            Logout
        </button>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 overflow-auto p-6 relative">
      <slot />
    </main>
  </div>
</div>
{/if}
