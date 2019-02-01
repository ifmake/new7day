import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ShareCommon } from 'src/app/share/share.component';
import { ShopIncomeService } from 'src/app/common/service/shop-service/shop-income.service';
import { switchMap } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-income-bill',
  templateUrl: './income-bill.component.html',
  styleUrls: ['./income-bill.component.less']
})
export class IncomeBillComponent extends ShareCommon implements OnInit {
  dataList: any;
  shopIncomeForm: FormGroup;
  OpenDraw: boolean;
  searchArray = [];
  shop_id = '';
  constructor(
    private shopIncomeService: ShopIncomeService,
    private shopService: ShopMaterialService,
    private fb: FormBuilder,
    public message: NzMessageService,
  ) {
    super();
    this.searchArray = [
      {key: 'shop', index: 1, name: '出货店面', show: true, isSelect: true, selectArr: [
        {value: 3, label: '迷你店'},
        {value: 5, label: '重百店'},
        {value: 6, label: '奎星店'},
        {value: 7, label: '白沙店'},
        {value: 8, label: '德感店'},
      ]},
    ];
     // 获取列表数据
     this.searchStream.pipe(switchMap(() => {
      return this.shopIncomeService.getShopIncomeList(this.searchObj);
    })).subscribe(res => {
      console.log(res);
      this.listLoading = false;
      this.dataList = res;
    });
     // 新增仓库
     this.shopIncomeForm = this.fb.group({
      shop: [{value: '', disabled: false}],
      income: [{value: '', disabled: false}],
    });
   }
  ngOnInit() {
    this.searchStream.next();
  }
  // 数刷新
  refresh(keys) {
    Object.assign(this.searchObj, keys);
    this.searchStream.next();
  }
  // 选择框变更
  selectChanges(change) {
    this.shop_id  = change;
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
    this.shopIncomeForm.reset();
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
      for (const i in this.shopIncomeForm.controls) {
        if (i) {
          this.shopIncomeForm.controls[i].markAsDirty();
          this.shopIncomeForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.shopIncomeForm.value.shop === null || this.shopIncomeForm.value.shop === '') {
        this.message.create('error', '选择店面');
        return;
      }
      if (this.shopIncomeForm.value.income === null || this.shopIncomeForm.value.income === '') {
        this.message.create('error', '请输入收入');
        return;
      }
      this.saveIncome();
    } else {
      this.OpenDraw = false;
    }
  }
  // 存入收入
  saveIncome() {
    this.shopIncomeService.createShopIncome(this.shopIncomeForm.value).subscribe(res => {
      if (!res.error) {
        this.OpenDraw = false;
        this.searchStream.next();
        this.message.create('success', '收入成功');
      } else {
        this.message.create('success', '收入失败，请重新收入');
      }
    });
  }
  // 导出当月店面数据
  downloadBill() {
    this.shopIncomeService.shopMonthExport({shop: this.shop_id}).subscribe(res => {
      const blob = new Blob([res], {type: 'application/ms-excel'});
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl) ;
    });
  }
}
