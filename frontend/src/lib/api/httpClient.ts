import { AppConfig } from '$lib/config';


// how to use the httpClient
// Example: 
//--------------------------------
// src/lib/api/todos.ts
// import { httpClient } from './httpClient';
// export async function getTodos() {
//   return httpClient.get('/todos');
// }
// export async function addTodo(text: string) {
//   return httpClient.post('/todos', { text });
// }
//--------------------------------
// implement with store 
// Example: 
// import { getTodos, addTodo } from '$lib/api/todos';
// onMount(async () => {
//     const todos = await getTodos();
//     console.log(todos);
//   });
//   await addTodo('Buy coffee');
//--------------------------------

export type ApiResponse<T> = {
    statusCode: number;
    message: string;
    data?: T | null;
    timestamp?: string;
    path?: string;
}

async function request<T>(path:string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token')
    const res = await fetch(`${AppConfig.apiBaseUrl}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(await safeErrorMessage(res));
    }

    return res.json() as Promise<ApiResponse<T>>;
}

async function safeErrorMessage<T>(response: Response): Promise<string> {
    try {
        const data = await response.json() as ApiResponse<T>;
        return data.message ?? `HTTP ${data.statusCode} error`;
    } catch (error) {
        console.error(error);
        return `HTTP ${response.status}`;
    }
}

export const httpClient = {
    get:<T>(path:string):Promise<ApiResponse<T>> => request(path, { method: 'GET' }) as Promise<ApiResponse<T>>,
    post:<T>(path:string, data: unknown): Promise<ApiResponse<T>> => request(path, { method: 'POST', body: JSON.stringify(data) }) as Promise<ApiResponse<T>>,
    put:<T>(path:string, data: unknown): Promise<ApiResponse<T>> => request(path, { method: 'PUT', body: JSON.stringify(data) }) as Promise<ApiResponse<T>>,
    delete:<T>(path:string): Promise<ApiResponse<T>> => request(path, { method: 'DELETE' }) as Promise<ApiResponse<T>>,
}
