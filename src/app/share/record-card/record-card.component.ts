import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.component.html',
  styleUrls: ['./record-card.component.less']
})
export class RecordCardComponent implements OnInit, OnChanges {
  @Input() recordListArr: any = [];
  @Input() recordType: string;
  @Input() formCard: boolean;
  @Output() recordProduct: EventEmitter<any> = new EventEmitter<any>();
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  operateForm: FormGroup;
  sourceslist = [];
  storelist = [];
  constructor(
    private fb: FormBuilder,
    private stockService: StockListService
  ) {
    this.operateForm = this.fb.group({
      goods_id: [{value: '', disabled: false}, [Validators.required]],
      price: [{value: '', disabled: false}, [Validators.required]],
      count: [{value: null, disabled: false}, [Validators.required]],
      unit: [{value: null, disabled: false}, [Validators.required]],
      source: [{value: null, disabled: false}, [Validators.required]],
      operate_depot: [{value: null, disabled: false}, [Validators.required]],
    });
    this.storelist = [
      {label: '总仓库', value: '1'},
      {label: '分仓库', value: '2'},
    ];
  }

  ngOnInit() {

  }
  ngOnChanges(change) {
    if (this.recordType === 'depot_in') {
      this.sourceslist = [
        {label: '供货商', value: 0},
        {label: '总仓库', value: 1},
        {label: '分仓库', value: 2},
      ];
    } else {
      this.sourceslist = [
        {label: '分仓库', value: 3},
        {label: '店面', value: 4},
      ];
    }
    console.log(this.recordListArr);
    if (this.recordListArr.length  > 0 && this.recordListArr.length  < 2) {
      const formObj = {
        goods_id: this.recordListArr[0].id,
        price: this.recordListArr[0].last_price,
        unit: this.recordListArr[0].unit,
        count: '',
        source: '',
        operate_depot: '1'
      };
      this.operateForm.setValue(formObj);
      console.log(this.operateForm.value);
    }
  }
  // 清空表单
  clearForm() {
    this.operateForm.controls.count.reset();
    this.operateForm.controls.price.reset();
  }
  // 表单提交
  submitForm(recode) {
    for (const i in this.operateForm.controls) {
      if (i) {
        this.operateForm.controls[ i ].markAsDirty();
        this.operateForm.controls[ i ].updateValueAndValidity();
      }
    }
      this.operateForm.patchValue({goods_id: recode.id});
      const stockForm  = Object.assign({}, recode, {goods_info: [this.operateForm.value], order_type: this.recordType});
      this.stockService.stockAndSend(stockForm).subscribe(results => {
        if (!results.error) {
          this.callBack.emit(results);
        }
      });
  }
  //  进货出货
  operateRecord(type) {
    this.recordProduct.emit(type);
  }
}
