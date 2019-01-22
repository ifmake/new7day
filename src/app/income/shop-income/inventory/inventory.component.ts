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
  constructor(
    private productService: ProductService,
    private shopService: ShopMaterialService,
    private shopInventoryService: ShopInventoryService,
    private shopIncomeService: ShopIncomeService,
    private fb: FormBuilder,
    public message: NzMessageService,
  ) {
    super();
    this.productSpec = '选择商品';
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
    });
   }
  ngOnInit() {
    this.searchStream.next();
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
    this.isLoading = true;
    this.searchProdObj.search = msg;
    this.productStream.next();
  }
  loadMore() {
    this.searchProdObj.page_size  = this.searchProdObj.page_size + 5 ;
    this.productStream.next();
  }
  // 刷新
  refresh() {
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
