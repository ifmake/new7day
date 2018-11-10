export class ChartsOption {
    title: any;
    xAxis: any;
    tooltip: any;
    legend: any;
    yAxis: any;
    series: Array<Object>;
    constructor( data: any = {}) {
        this.title = data.title || new ChartTitle();
    }
}

export class ChartTitle {
    text: string;
    constructor(data: any = {}) {
        this.text = data.text || '标题';
    }
}

export class ChartXaxis {
    type: string;
    data: Array<any>;
    constructor(data: any = {}) {
        this.type = data.type || 'category';
        this.data = data.data || [];
    }
}

export class ChartTooltip {
    trigger: string;
    axisPointer: Array<any>;
    constructor(data: any = {}) {
        this.trigger = data.trigger || 'axis';
        this.axisPointer = data.axisPointer || { animation: false};
    }
}

export class ChartLegend {
    data: Array<any>;
    constructor(data: any = {}) {
        this.data = data.data || [];
    }
}



