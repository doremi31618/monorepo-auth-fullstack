import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import * as authAPI from '$lib/api/auth'

export type UserIdentity = {
    id: string;
    email: string;
    name: string;
}

export type Session = {
    accessToken: string;
    expiresAt: number;
    user: UserIdentity | null;
    refreshToken: string;

}

export type AuthStore = {subscribe: Writable<Session | null>['subscribe']} & {
    register: (username: string, email: string, password: string) => Promise<Session>;
    login: (email: string, password: string) => Promise<Session>;
    logout: () => Promise<void>;
    refresh: () => Promise<Session>;
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

function writeToStorage(s: Session | null){
    if (!browser) return;
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function removeFromStorage(){
    if (!browser) return;
    if (localStorage.getItem(STORAGE_KEY))localStorage.removeItem(STORAGE_KEY);
}


function createAuthStore(): AuthStore {
    const {subscribe, set } = writable<Session | null>(null)

    return {
        subscribe,
        async register (_username: string, email: string, _password: string){
            // use api get session
            const session = await authAPI.register(_username, email, _password) as Session;
            // set session to store
            set(session);
            // write to storage    
            writeToStorage(session);
            return session;
        },
        async login (_email: string, _password: string){
            //api: api/auth/login
            const session = await authAPI.login(_email, _password) as Session;
            set(session);
            writeToStorage(session);
            return session;
        },
        async logout () {
            // api: api/auth/logout
            await authAPI.logout();
            removeFromStorage();
            set(null);
        },
        async refresh (){
            // api: api/auth/refresh
            const session = await authAPI.refresh() as Session;
            set(session);
            writeToStorage(session);
            return session;
        }
    } 
}

export const authStore = createAuthStore();