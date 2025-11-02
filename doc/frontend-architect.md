

⸻

🧱 前端架構說明文件

1. 架構總覽

本專案採用 Svelte 5 為核心框架，搭配模組化資料與 API 管理結構，以確保：
	•	低耦合、高可維護性
	•	明確的資料流向
	•	便於擴充的組件化架構

Component → Store → API → httpClient → Backend

	•	Component：負責顯示 UI 與用戶互動。
	•	Store（資料窗口）：負責管理狀態與操作資料的方法。
	•	API 層：封裝所有後端 API 呼叫。
	•	httpClient：統一處理 fetch、header、token、錯誤處理。
	•	Backend：實際的伺服器端服務（例如 AdonisJS、Spring Boot 等）。

⸻

2. 專案目錄結構
```
src/
  lib/
    api/                # 集中管理所有 API 請求
      httpClient.ts     # 統一封裝 fetch、token、錯誤處理
      todos.ts          # 模組化 API 定義
      auth.ts
      users.ts
    stores/             # 狀態管理與資料操作
      todoStore.ts
      authStore.ts
      uiStore.ts
    types/              # 共用型別定義
      todo.ts
      user.ts
    components/         # 可重用 UI 元件
      TodoList.svelte
      TodoItem.svelte
  routes/               # 頁面路由 (SvelteKit)
    +page.svelte
    todos/
      +page.svelte
```

⸻

3. 資料流與職責分層

層級	職責	實作位置
Component	顯示資料、處理事件、呼叫 store 方法	/routes、/lib/components
Store	保存狀態、呼叫 API、更新資料	/lib/stores
API	定義後端端點與資料轉換邏輯	/lib/api
httpClient	統一 fetch、header、error handling	/lib/api/httpClient.ts


⸻

4. httpClient 設計

httpClient.ts 是全專案所有 API 呼叫的基礎封裝層。
它的作用是統一處理：
	•	Base URL
	•	Token 驗證
	•	錯誤處理
	•	統一回傳格式
```
// src/lib/api/httpClient.ts
const BASE_URL = 'https://example.com/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const msg = await safeErrorMessage(res);
    throw new Error(msg);
  }

  return res.json();
}

async function safeErrorMessage(res: Response) {
  try {
    const data = await res.json();
    return data.message ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export const httpClient = {
  get: <T>(path: string) => request(path) as Promise<T>,
  post: <T>(path: string, body: unknown) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }) as Promise<T>,
  put: <T>(path: string, body: unknown) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }) as Promise<T>,
  del: <T>(path: string) =>
    request(path, { method: 'DELETE' }) as Promise<T>
};
```

⸻

5. API 模組層

在這一層，我們把每個後端模組（auth、todos、users…）封裝成獨立檔案。
```
// src/lib/api/todos.ts
import { httpClient } from './httpClient';

export type TodoDTO = { id: string; text: string; done: boolean };
export type Todo = { id: string; text: string; completed: boolean };

function mapDTOtoTodo(dto: TodoDTO): Todo {
  return { id: dto.id, text: dto.text, completed: dto.done };
}

export async function fetchTodos(): Promise<Todo[]> {
  const list = await httpClient.get<TodoDTO[]>('/todos');
  return list.map(mapDTOtoTodo);
}

export async function createTodo(text: string): Promise<Todo> {
  const dto = await httpClient.post<TodoDTO>('/todos', { text });
  return mapDTOtoTodo(dto);
}
```

⸻

6. Store（資料窗口）層

Store 層是 前端的資料中樞。
負責保存狀態、提供方法給 UI 使用。

```
// src/lib/stores/todoStore.ts
import { writable } from 'svelte/store';
import { fetchTodos, createTodo, type Todo } from '$lib/api/todos';

function createTodoStore() {
  const { subscribe, set, update } = writable<Todo[]>([]);

  return {
    subscribe,
    async loadAll() {
      const todos = await fetchTodos();
      set(todos);
    },
    async add(text: string) {
      const newTodo = await createTodo(text);
      update(t => [newTodo, ...t]);
    },
    toggle(id: string) {
      update(t => t.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };
}

export const todoStore = createTodoStore();
```

⸻

7. Component 層

在 Svelte component 中，我們透過 store 操作資料，不直接呼叫 API。
```
<script lang="ts">
  import { onMount } from 'svelte';
  import { todoStore } from '$lib/stores/todoStore';

  let newText = '';
  let todos = [];

  onMount(() => {
    todoStore.loadAll();
    const unsubscribe = todoStore.subscribe(v => todos = v);
    return () => unsubscribe();
  });

  const add = async () => {
    if (newText.trim()) {
      await todoStore.add(newText.trim());
      newText = '';
    }
  };
</script>

<input bind:value={newText} placeholder="Add new todo..." />
<button on:click={add}>Add</button>

<ul>
  {#each todos as t}
    <li>
      <input type="checkbox" checked={t.completed} on:change={() => todoStore.toggle(t.id)} />
      {t.text}
    </li>
  {/each}
</ul>

```
⸻

8. 設計原則

原則	說明
🔒 單一責任原則	Component 不直接處理資料存取，只透過 store。
🧩 模組化設計	每個 API 模組與 store 都應對應單一業務領域。
🔁 可重用性	store 與 httpClient 可於多個模組中重複使用。
🚨 錯誤集中處理	所有錯誤都統一在 httpClient 處理。
🧠 型別明確	DTO（後端格式）與 Domain Model（前端格式）應分離。


⸻

9. 延伸功能建議

功能	建議實作位置
JWT refresh token	httpClient.request() 中自動處理 401
Global loading UI	建立 uiStore 管理 loading 狀態
Cache 機制	Store 層加入 timestamp 與 revalidate 判斷
Offline 支援	使用 localStorage / IndexedDB 快取資料
Type 安全	搭配 Zod / TypeScript 型別檢查


⸻

10. 總結

此架構的核心價值在於「分層 + 模組化 + 可替換性」。
Svelte 元件專注於 UI 呈現，所有資料流經過 store 統一管理，並由 httpClient 控制通訊細節。
這樣的設計能讓你在專案擴大時仍能保持穩定、可測試、可維護。

⸻

