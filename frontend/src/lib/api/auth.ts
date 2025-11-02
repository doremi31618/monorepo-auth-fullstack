import { httpClient } from './httpClient';

export async function login(email: string, password: string) {
    return httpClient.post('/auth/login', { email, password });
}

export async function register(name: string, email: string, password: string) {
    return httpClient.post('/auth/register', { name, email, password });
}

export async function logout(){
    return httpClient.post('/auth/signout', {});
}

export async function refresh(){
    return httpClient.post('/auth/refresh', {});
}