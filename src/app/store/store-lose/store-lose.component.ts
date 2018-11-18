import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StoreCommon } from '../store_common.compoennt';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { StockLoseService } from '../../common/service/product-service/product-lose.service';
import { switchMap } from 'rxjs/operators';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { ProductService } from 'src/app/common/service/product.service';
import { StoreService } from 'src/app/common/service/store.service';

@Component({
  selector: 'app-store-lose',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './store-lose.component.html',
  styleUrls: ['./store-lose.component.css']
})
export class StoreLoseComponent extends StoreCommon implements OnInit {
  productStream = new Subject<any>();
  searchProdObj = {
    search: '',
    page: 1,
    page_size: 100,
  };
  isLoading: boolean;
  storeStream = new Subject<any>();
  productSpec: any;
  dataList: any;
  loseFrom: FormGroup;
  look: boolean;
  title: string;
  constructor(
    private fb: FormBuilder,
    public message: NzMessageService,
    public stockLoseService: StockLoseService,
    public productService: ProductService,
    private storeService: StoreService,
  ) {
    super();
    this.productSpec = '选择商品';
    this.searchArray = [
      {key: 'goods_name', index: 0, name: '商品名称', show: true},
      {key: 'data.operator_account', index: 5, name: '操作人', show: true},
      {key: 'effect_datfrom', index: 3, name: '报损时间起', show: false, isTime: true},
      {key: 'effect_dateto', index: 4, name: '报损时间止', show: false, isTime: true}
    ];

    // 列表查询
    this.searchStream.pipe(switchMap(() => {
      return this.stockLoseService.getLoseList(this.searchObj);
    })).subscribe(res => {
      this.dataList = res;
      this.listLoading = false;
    });
    // 所有商品查询
    this.productStream.pipe(switchMap(() => {
      return this.productService.getProductList(this.searchProdObj);
    })).subscribe(res => {
      this.isLoading = false;
      this.productList = res['results'];
      console.log(this.productList);
    });
    // 查询所有仓库列表
    this.storeStream.pipe(switchMap(() => {
      return this.storeService.getStoreList(this.searchObj);
    })).subscribe(res => {
      this.storeList = res['results'];
    });
    // 添加商品损耗
    this.loseFrom = this.fb.group({
      goods: [{value: '', disabled: false}],
      goods_name: [{value: '', disabled: false}, [Validators.required]],
      price: [{value: null, disabled: false}, [Validators.required]],
      damaged_depot: [{value: '', disabled: false}, [Validators.required]],
      address: [{value: '', disabled: false}],
      count: [{value: null, disabled: false}, [Validators.required]],
      remarks: [{value: '', disabled: false}],
    });
   }

  ngOnInit() {
    this.searchStream.next();
  }
  // 数据查询
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
    this.searchStream.next();
  }
  // 数据分页
  changPageIndex(page) {
    this.searchObj.page = page;
    this.searchStream.next();
  }
  PageSizeChange(pageSize) {
    this.searchObj.page_size = pageSize;
    this.searchStream.next();
  }
  /**
   * 商品报损管理
   */
  // 新增
  add() {
    this.title = '新增';
    this.OpenDraw = true;
    this.look = false;
    this.formTitle = '供应商新增';
    this.loseFrom.reset();
    this.productStream.next();
    this.storeStream.next();
    for (const key in this.loseFrom.controls) {
      if (key) {
        this.loseFrom.controls[key].enable();
      }
    }
  }
  // 查询指定商品
  selectProduct(prod) {
    if (prod) {
        this.productService.getProductDetail(prod).subscribe(res => {
          this.productSpec = res['unit'];
        });
    }
  }
  // 查询更多商品
  searchProd(msg) {
    this.searchProdObj.search = msg;
    this.productStream.next();
  }
  loadMore() {
    this.searchProdObj.page_size ++ 
    this.productStream.next();
  }
  // 报损
  dataBack(msg) {
    if (msg.status) {
      for (const i in this.loseFrom.controls) {
        if (i) {
          this.loseFrom.controls[i].markAsDirty();
          this.loseFrom.controls[i].updateValueAndValidity();
        }
      }
      if (this.loseFrom.value.good === null || this.loseFrom.value.good === '') {
        this.message.create('error', '请选择商品');
        return;
      }
      if (this.loseFrom.value.damaged_depot === null || this.loseFrom.value.damaged_depot === '') {
        this.message.create('error', '选择报损仓库');
        return;
      }
      if (this.loseFrom.value.price === null || this.loseFrom.value.price === '') {
        this.message.create('error', '商品价格必填');
        return;
      }
      if (this.loseFrom.value.count === null || this.loseFrom.value.count === '') {
        this.message.create('error', '报损数量必填');
        return;
      }
      if (!this.loseFrom.value.remarks) {
        this.message.create('error', '报损原因必填');
        return;
      }
      this.saveSupplier();
    } else {
      this.OpenDraw = false;
    }
  }
  // 报损保存
  saveSupplier(): void {
    this.loseFrom.value.count = parseInt(this.loseFrom.value.count, 10);
    this.loseFrom.value.price = parseInt(this.loseFrom.value.price, 10);
     this.stockLoseService.createLose(this.loseFrom.value).subscribe(res => {
      if (res.error) {
        this.message.create('error', '格式不正确');
      } else {
        this.message.create('success', '添加成功');
        setTimeout(() => {
          this.OpenDraw = false;
          this.searchStream.next();
        }, 2000);
      }
     });
  }
  // 查看报损情况
  reviseDetail(id): void {
    if (id) {
      this.title = '查看';
      this.productStream.next();
      this.storeStream.next();
      this.stockLoseService.getLoseDetail(id).subscribe (res => {
        if (!res.error) {
          this.OpenDraw = true;
          this.look = true;
          this.productSpec = res['goods_unit'];
          for (const  key in this.loseFrom.value) {
            if (res[key]) {
              this.loseFrom.patchValue({key: res[key], disabled: this.look});
              this.loseFrom.controls[key].reset(res[key]);
              this.loseFrom.controls[key].disable();
            }
          }
        }
      });
    }
  }
}
