

const API_PREFIX = 'http://47.93.0.160:8000';

// 用户登录资料管理
export const login_api = {
    login: () => `${API_PREFIX}/auth/login/`,
};

// 资料管理
export const api_product = {
    list: () => `${API_PREFIX}/goods/goods/`,
    detail: (id) => `${API_PREFIX}/goods/goods/${id}/`,  // 查询或删除地址
    create: () => `${API_PREFIX}/goods/goods/`,
};

