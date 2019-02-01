import { environment } from 'src/environments/environment';

// tslint:disable-next-line:no-unused-expression
const API_PREFIX = environment.API_PREFIX;
// const API_PREFIX = 'http://192.168.1.4:8000';
// const API_PREFIX = envToken;

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
    changePass: () => `${API_PREFIX}/account/change_password/`
};

/**
 * 进出货管理模块
 */
export const api_productIX = {
    list: () => `${API_PREFIX}/goods/goods/stock/`,
    stockAndSend: () => `${API_PREFIX}/order/order/new/`,
    recordsList: () => `${API_PREFIX}/goods/goodsrecord/`,
    goodsrecord: () => `${API_PREFIX}/goods/goodsrecord/`,
    deleteOrder: (order) => `${API_PREFIX}/order/order/${order}`
};

/**
 * 仓库成本模块
 */
export const api_cost = {
    list: () => `${API_PREFIX}/goods/goods/cost/`,
    monthAdjust: () => `${API_PREFIX}/goods/goods/stats/`
};

/**
 * 商品损耗模块
 */
export const api_lose = {
    list: (id?: any) => {
        if (id) {
            return `${API_PREFIX}/goods/damaged/${id}`;
        } else {
            return `${API_PREFIX}/goods/damaged/`;
        }
    }
};

/**
 * 店面资料模块
 */
export const api_shop = {
    list: (id?: any) => {
        if (id) {
            return `${API_PREFIX}/shop/shop/${id}/`;
        } else {
            return `${API_PREFIX}/shop/shop/`;
        }
    }
};

/**
 * 店面收支情况
 */
export const api_shop_income = {
    list: (id?: any) => {
        if (id) {
            return `${API_PREFIX}/shop/income/`;
        } else {
            return `${API_PREFIX}/shop/income/`;
        }
    },
    stats: () => {
        return `${API_PREFIX}/shop/income/stats/`;
    },
    download: () => {
        return `${API_PREFIX}/shop/shop/month_use_export`;
    }
};
/**
 * 店面库存盘点
 */
export const api_shop_inventory = {
    list: (id?: any) => {
        if (id) {
            return `${API_PREFIX}/shop/inventory/`;
        } else {
            return `${API_PREFIX}/shop/inventory/`;
        }
    },
    stats: () => {
        return `${API_PREFIX}/shop/income/inventory/`;
    }
};







