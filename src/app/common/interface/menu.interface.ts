// 菜单多窗口
export interface ActiveMenus {
    title: string;
    link: string;
    module: string;
    active: string;
    power: string;
    select: boolean;
}
export interface RightsMenus {
    title: string;
    link: string;
    active: string;
    select: boolean;
    childs: Array<any>;
}
