import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ShareCommon } from 'src/app/share/share.component';
import { ShopIncomeService } from 'src/app/common/service/shop-service/shop-income.service';
import { switchMap } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ProductService } from 'src/app/common/service/product.service';
import { Subject } from 'rxjs';
import { ShopInventoryService } from 'src/app/common/service/shop-service/shop-inventory.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less']
})
export class InventoryComponent extends ShareCommon implements OnInit {
  // 查询所有商品
  productStream = new Subject<any>();
  searchProdObj = {
    search: '',
    page: 1,
    page_size: 100,
  };
  isLoading: boolean;
  // 店铺库存盘点
  dataList: any;
  shopInventoryForm: FormGroup;
  OpenDraw: boolean;
  productSpec: string;
  currentMonth = '';
  uploadUrl = '';
  constructor(
    private productService: ProductService,
    private shopService: ShopMaterialService,
    private shopInventoryService: ShopInventoryService,
    private shopIncomeService: ShopIncomeService,
    private fb: FormBuilder,
    public message: NzMessageService,
  ) {
    super();
    this.uploadUrl = environment.API_PREFIX + '/shop/inventory/file_import/';
    this.currentMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01';
    this.productSpec = '选择商品';
    this.searchArray = [
      {key: 'search', index: 0, name: '商品查询', show: true},
      {key: 'month', index: 1, name: '选择月份', show: true},
      {key: 'shop', index: 2, name: '出货店面', show: true, isSelect: true, selectArr: [
        {value: 3, label: '迷你店'},
        {value: 5, label: '重百店'},
        {value: 6, label: '奎星店'},
        {value: 7, label: '白沙店'},
        {value: 8, label: '德感店'},
      ]},
      // {key: 'month', value: this.currentMonth, index: 0, name: '核算时间起', show: true, isTime: true, },
    ];
     // 获取列表数据
     this.searchStream.pipe(switchMap(() => {
      return this.shopInventoryService.getShopInventoryList(this.searchObj);
    })).subscribe(res => {
      console.log(res);
      this.listLoading = false;
      this.dataList = res;
    });
     // 所有商品查询
     this.productStream.pipe(switchMap(() => {
      return this.productService.getProductList(this.searchProdObj);
    })).subscribe(res => {
      this.isLoading = false;
      this.productList = res['results'];
    });
     // 新增仓库
     this.shopInventoryForm = this.fb.group({
      shop: [{value: '', disabled: false}],
      goods: [{value: '', disabled: false}],
      price: [{value: '', disabled: false}],
      stock: [{value: '', disabled: false}],
      month: [{value: new Date().getFullYear + '-' + (new Date().getMonth() + 1), disabled: false}]
    });
   }
  ngOnInit() {
    this.searchStream.next();
  }
  // 查询指定商品
  selectProduct(prod) {
    if (prod) {
        this.productService.getProductDetail(prod).subscribe(res => {
          this.shopInventoryForm.patchValue({price: res.last_price});
          this.productSpec = res['unit'];
        });
    }
  }
   // 查询更多商品
   searchProd(msg) {
    console.log(msg);
    this.isLoading = true;
    this.searchProdObj.search = msg;
    this.productStream.next();
  }
  loadMore() {
    this.searchProdObj.page_size  = this.searchProdObj.page_size + 5 ;
    this.productStream.next();
  }
  // 刷新
  refresh(keys) {
    Object.assign(this.searchObj, keys);
    this.searchStream.next();
  }
  // 分页查询
  changPageIndex(page) {
    this.searchObj.page = page;
    this.searchStream.next();
  }
  PageSizeChange(size) {
    this.searchObj.page_size = size;
    this.searchStream.next();
  }
  // 添加收入弹窗
   add() {
    this.shopInventoryForm.reset();
    this.shopInventoryForm.patchValue({month: new Date().getMonth()});
    this.OpenDraw = true;
    this.shopService.getShopMaterialList({ page: 1, page_size: 10}).subscribe(res => {
      if (!res.error) {
        this.shopList = res.results;
      }
    });
  }
   // 确认添加
   dataBack(msg) {
    if (msg.status) {
      for (const i in this.shopInventoryForm.controls) {
        if (i) {
          this.shopInventoryForm.controls[i].markAsDirty();
          this.shopInventoryForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.shopInventoryForm.value.shop === null || this.shopInventoryForm.value.shop === '') {
        this.message.create('error', '选择店面');
        return;
      }
      if (this.shopInventoryForm.value.goods === null || this.shopInventoryForm.value.goods === '') {
        this.message.create('error', '请选择货物');
        return;
      }
      if (this.shopInventoryForm.value.stock === null || this.shopInventoryForm.value.stock === '') {
        this.message.create('error', '请输入货物剩余数量');
        return;
      }
      if (this.shopInventoryForm.value.price === null || this.shopInventoryForm.value.price === '') {
        this.message.create('error', '请输入货物单价');
        return;
      }
      if (this.shopInventoryForm.value.month === null || this.shopInventoryForm.value.month === '') {
        this.message.create('error', '请选择盘点月分');
        return;
      }
      this.saveInventory();
    } else {
      this.OpenDraw = false;
    }
  }
  // 存入收入
  saveInventory() {
    this.shopInventoryService.createShopInventory(this.shopInventoryForm.value).subscribe(res => {
      if (!res.error) {
        this.OpenDraw = false;
        this.searchStream.next();
        this.message.create('success', '添加成功');
      } else {
        this.message.create('error', res.error.error);
      }
    });
  }
}
