import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  searchStream = new Subject<any>();
  searchRecordObj: any;
  recordLokkArr: any = [];
  constructor(
    private fb: FormBuilder,
    public message: NzMessageService,
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
    this.searchRecordObj = {
      goods_id: '',
      page: 1,
      page_size: 10,
    };
  // 历史记录查询
  this.searchStream.pipe(switchMap(() => {
    return this.stockService.getDetail(this.searchRecordObj);
  })).subscribe(res => {
    if (this.recordType === 'import') {
      for (let i = 0; i < res['results'].length; i++) {
        if (res['results'][i]['record_type'] === 'depot_in') {
          this.recordLokkArr.push(res['results'][i]);
        }
      }
    } else {
      for (let i = 0; i < res['results'].length; i++) {
        if (res['results'][i]['record_type'] === 'depot_out') {
          this.recordLokkArr.push(res['results'][i]);
        }
      }
    }
  });
  }


  ngOnInit() {}
  ngOnChanges(change) {
    // 记录查询
    if (!this.formCard) {
      this.searchStream.next();
    }
    // 进出货管理
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
  // 记录加载更多
  loadMore() {
    console.log('sdfjlsakdjf');
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
      this.operateForm.value.count = parseInt(this.operateForm.value.count, 10);
      this.operateForm.value.price = parseInt(this.operateForm.value.price, 10);
      const stockForm  = Object.assign({}, recode, {goods_info: [this.operateForm.value], order_type: this.recordType});
      this.stockService.stockAndSend(stockForm).subscribe(results => {
        if (!results.error) {
          this.callBack.emit(results);
        } else {
          this.message.create('warning', results.error);
        }
      });
  }
  //  进货出货
  operateRecord(type) {
    this.recordProduct.emit(type);
  }
}
