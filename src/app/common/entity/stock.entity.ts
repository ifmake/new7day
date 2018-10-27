
// 进货单实体
export class StockEntity {
    goods_id: string;
    count: number;
    price: string;
    unit: boolean;
    constructor(data: any = {}) {
        this.goods_id = data.key || '';
        this.count = data.index || 0;
        this.price = data.name || '';
        this.unit = data.show || '';
    }
}
