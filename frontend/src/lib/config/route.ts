


export const appRoutePath = {
    base: '/',
    auth: {
        login: '/auth/login',
        register: '/auth/signup',
        signout: '/auth/signout',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset',
    },
    user: {
        home: '/user/home',
    }
    

} as const;
