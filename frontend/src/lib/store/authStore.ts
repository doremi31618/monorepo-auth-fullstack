import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';


import * as authAPI from '$lib/api/auth'
import { appRoutePath } from '$lib/config/route';
export type UserIdentity = {
    id: string;
    email: string;
    name: string;
}


export type AuthStore = {subscribe: Writable<authAPI.Session | null>['subscribe']} & {
    register: (username: string, email: string, password: string) => Promise<authAPI.Session>;
    login: (email: string, password: string) => Promise<authAPI.Session>;
    logout: () => Promise<{userId: number}>;
    refresh: () => Promise<authAPI.Session>;
    InspectSession: () => Promise<authAPI.Session>;
}

const STORAGE_KEY = 'app.session.v1';

// read from storage, return Session | null
// function readFromStorage(): Session | null{
//     if (!browser) return null;
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return null;

//     try{
//         const s = JSON.parse(raw) as Session;
//         if (s.expiresAt && Date.now() > s.expiresAt) return null;
//         return s
//     }catch (error){
//         console.error('read session error', error);
//         return null;
//     }
// }

function writeToStorage(s: authAPI.Session | null){
    if (!browser) return;
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function removeFromStorage(){
    if (!browser) return;
    if (localStorage.getItem(STORAGE_KEY))localStorage.removeItem(STORAGE_KEY);
}


function createAuthStore(): AuthStore {
    const {subscribe, set } = writable<authAPI.Session | null>(null)

    return {
        subscribe,
        async InspectSession(){
            const response = await authAPI.InspectSession();
            if (response.statusCode !== 200){
                goto(appRoutePath.auth.login);
            }
            return response.data as authAPI.Session;
        },
        async register (_username: string, email: string, _password: string){
            // use api get session
            const response = await authAPI.register(_username, email, _password);
            // set session to store
            set(response.data as authAPI.Session);
            // write to local storage    
            writeToStorage(response.data as authAPI.Session);

            if (response.statusCode == 200){
                await goto(appRoutePath.user.home);
            }
            return response.data as authAPI.Session;
        },
        async login (_email: string, _password: string){
            //api: api/auth/login
            const response = await authAPI.login(_email, _password);
            set(response.data as authAPI.Session);
            writeToStorage(response.data as authAPI.Session);
            console.info('login response', response, appRoutePath.user.home);
            if (response.statusCode == 200){
                console.info('redirecting to home');
                await goto(appRoutePath.user.home);
            }
            return response.data as authAPI.Session;
        },
        async logout () {
            // api: api/auth/logout
            const response = await authAPI.logout();
            removeFromStorage();
            set(null);
            if (response.statusCode == 200){
                await goto( appRoutePath.base );
            }
            return { userId: 0 };
        },
        async refresh (){
            // api: api/auth/refresh
            const response = await authAPI.refresh();
            set(response.data as authAPI.Session);
            writeToStorage(response.data as authAPI.Session);
            return response.data as authAPI.Session;
        }
    } 
}

export const authStore = createAuthStore();