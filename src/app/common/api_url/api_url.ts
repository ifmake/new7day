

const API_PREFIX = 'http://47.93.0.160:8000';

// 用户登录资料管理
export const login_api = {
    login: () => `${API_PREFIX}/auth/login/`,
};

/**
 * 资料管理
 */
// 商品资料
export const api_product = {
    list: () => `${API_PREFIX}/goods/goods/`,
    detail: (id) => `${API_PREFIX}/goods/goods/${id}/`,  // 查询或删除地址
    create: () => `${API_PREFIX}/goods/goods/`,
};
// 仓库资料
export const api_store = {
    list: () => `${API_PREFIX}/depot/depot/`,
    detail: (id) => `${API_PREFIX}/depot/depot/${id}/`,  // 查询或删除或修改地址
    create: () => `${API_PREFIX}/depot/depot/`,
};
// 供应商资料
export const api_supplier = {
    list: () => `${API_PREFIX}/supplier/supplier/`,
    detail: (id) => `${API_PREFIX}/supplier/supplier/${id}/`,  // 查询或删除或修改地址
    create: () => `${API_PREFIX}/supplier/supplier/`,
};
// 员工资料
export const api_account = {
    list: () => `${API_PREFIX}/account/profile/`,
    detail: (id) => `${API_PREFIX}/account/profile/${id}/`,  // 查询或删除或修改地址
    create: () => `${API_PREFIX}/account/profile/`,
};

/**
 * 进出货管理模块
 */
export const api_productIX = {
    list: () => `${API_PREFIX}/goods/goods/stock/`,
    stockAndSend: () => `${API_PREFIX}/order/order/new/`,
    recordsList: () => `${API_PREFIX}/goods/goodsrecord/`,
    orderDetail: (id) => `${API_PREFIX}/order/order/${id}`
};

/**
 * 仓库成本模块
 */
export const api_cost = {
    list: () => `${API_PREFIX}/goods/goods/cost/`
};





