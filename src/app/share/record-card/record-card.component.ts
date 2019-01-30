import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.component.html',
  styleUrls: ['./record-card.component.less'],
  providers: [DatePipe]
})
export class RecordCardComponent implements OnInit, OnChanges {
  @Input() recordListArr: any = [];
  @Input() recordType: string;
  @Input() formCard: boolean;
  @Input() currentID: any;
  // 进出货表单
  @Input() IsMaster: boolean; // 是否为总仓库
  @Output() recordProduct: EventEmitter<any> = new EventEmitter<any>();
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  operateForm: FormGroup;
  sourceslist = [];
  shopList = [];
  storelist = [];
  searchStream = new Subject<any>();
  searchRecordObj: any;
  recordLokkArr: any = [];
  dateFormat: 'yyyy-MM-dd';
  isMasterStore: boolean;
  selectDepotInType = 'A';  // 进货类型
  IsBtnLoading: boolean;
  constructor(
    private fb: FormBuilder,
    public message: NzMessageService,
    private stockService: StockListService,
    private shopService: ShopMaterialService,
    private datePipe: DatePipe,
  ) {
    this.operateForm = this.fb.group({
      goods_id: [{value: '', disabled: false}, [Validators.required]],
      price: [{value: '', disabled: false}, [Validators.required]],
      count: [{value: null, disabled: false}, [Validators.required]],
      unit: [{value: null, disabled: false}, [Validators.required]],
      source: [{value: null, disabled: false}, [Validators.required]],
      operate_depot: [{value: null, disabled: false}, [Validators.required]],
      production_date: [{value: null, disabled: false}, [Validators.required]],
      expiration_date: [{value: null, disabled: false}, [Validators.required]],
      from_depot: [{value: null, disabled: false}],
      supplier: [{value: null, disabled: false}],
      shop: [{value: '', disabled: false}],
    });

    this.searchRecordObj = {
      goods_id: '',
      page: 1,
      page_size: 10,
    };
  // 历史记录查询
  this.searchStream.pipe(switchMap(() => {
    return this.stockService.getDetail(this.searchRecordObj);
  })).subscribe(res => {
    if (res['results'].length) {
    this.recordLokkArr = res['results'];
  }

  });
  }


  ngOnInit() {}
  ngOnChanges(change) {
    console.log(change);
    // 是否为总仓库
    if (this.IsMaster) {
      this.storelist = [
        {label: '总仓库', value: '1'},
      ];
      this.operateForm.patchValue({operate_depot: '1'});
    } else {
      this.selectDepotInType  = 'A';
      this.storelist = [
        {label: '分仓库', value: '2'},
      ];
      this.operateForm.patchValue({operate_depot: '2'});
    }
    // 记录查询
    if (!this.formCard) {
      console.log('商品Id', this.currentID);
      if (this.currentID) {
        this.searchRecordObj.goods_id = this.currentID;
      }
      this.searchStream.next();
    }
    // 进出货管理
    if (this.recordType === 'depot_in') {
      this.sourceslist = [
        {label: '供货商', value: 1},
      ];
    } else {
      this.shopService.getShopMaterialList({ page: 1, page_size: 10}).subscribe(res => {
        console.log(res);
        if (!res.error) {
          const AllShopList = res.results;
          if (this.IsMaster) {
            this.shopList = AllShopList.filter((shop) => shop.type !== 'direct');
          } else {
            this.shopList = AllShopList;
          }
        }
      });
    }
    if (this.recordListArr.length  > 0 && this.recordListArr.length  < 2) {
      const formObj = {
        goods_id: this.recordListArr[0].id,
        price: this.recordListArr[0].last_price,
        unit: this.recordListArr[0].unit,
        count: '',
        source: '',
        operate_depot: '',
        shop: '',
        production_date: '',
        expiration_date: '',
        from_depot: null,
        supplier: null,
      };
      if (this.IsMaster) {
        formObj.operate_depot = '1';
      } else {
        formObj.operate_depot = '2';
      }
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
  // 获取操作仓库
  getOperateStore(store) {
    if (store === 1) {
      console.log('总仓库');
      this.isMasterStore = true;
    } else {
      this.isMasterStore = false;
    }
  }
  // 表单提交
  submitForm(recode) {
    if (this.IsBtnLoading === true) {
      this.message.create('warning', '请勿重复提交');
      return;
    }
    this.IsBtnLoading = true;
    for (const i in this.operateForm.controls) {
      if (i) {
        this.operateForm.controls[ i ].markAsDirty();
        this.operateForm.controls[ i ].updateValueAndValidity();
      }
    }
    if (this.recordType === 'depot_out' && !this.operateForm.value.shop) {
       this.message.create('warning', '选择店面出货');
       console.log(this.operateForm.value);
       return;
    }
    if (this.recordType === 'depot_in') {
      if (!this.operateForm.value.production_date) {
        this.message.create('warning', '生产日期必选');
        return;
      }
      if (!this.operateForm.value.expiration_date) {
        this.message.create('warning', '过期日期必选');
        return;
      }
    }
      this.operateForm.patchValue({goods_id: recode.id});
      this.operateForm.value.count = parseFloat(this.operateForm.value.count);
      this.operateForm.value.price = parseFloat(this.operateForm.value.price);
      this.operateForm.value.production_date = this.datePipe.transform(this.operateForm.value.production_date, 'yyyy-MM-dd');
      this.operateForm.value.expiration_date = this.datePipe.transform(this.operateForm.value.expiration_date, 'yyyy-MM-dd');
      const GoodInfoObj = this.operateForm.value;
      if (this.recordType === 'depot_in') {
        delete GoodInfoObj.shop;
      }
      const stockForm  = Object.assign({}, recode, {goods_info: [GoodInfoObj], order_type: this.recordType});
      this.stockService.stockAndSend(stockForm).subscribe(results => {
        this.IsBtnLoading = false;
        if (!results.error) {
          this.callBack.emit(results);
        } else {
          this.message.create('warning', results.error.error);
        }
      });
  }
  //  进货出货
  operateRecord(type) {
    this.recordProduct.emit(type);
  }
}
