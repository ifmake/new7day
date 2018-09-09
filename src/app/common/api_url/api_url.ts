

const API_PREFIX = 'http://47.93.0.160:8000';

// 用户登录资料管理
export const login_api = {
    login: () => `${API_PREFIX}/auth/login`,
};

// 资料管理
export const material_api = {
    list: () => `${API_PREFIX}`,
    detail: () => ``,
    create: () => ``,
    delete: () => ``,
};

