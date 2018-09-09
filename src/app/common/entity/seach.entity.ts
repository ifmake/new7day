
// 数据条件查询
export class SearchEntity {
    key: string;
    index: number;
    name: string;
    show: boolean;
    isTime: boolean;
    constructor(data: any = {}) {
        this.key = data.key || '';
        this.index = data.index || 0;
        this.name = data.name || '';
        this.show = data.show || true;
        this.isTime = data.isTime || false;
    }
}
