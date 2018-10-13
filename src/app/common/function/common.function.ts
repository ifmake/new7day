// 查询对象转字符串
export function ObjChnageString(Obj) {
    let UrlString: string;
    if (Obj && Obj !== {}) {
        Object.keys(Obj).forEach(key => {UrlString += key + '=' + Obj[key] + '&'; });
    } else {
        return '';
    }
}
