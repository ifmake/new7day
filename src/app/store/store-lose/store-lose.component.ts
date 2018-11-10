import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StoreCommon } from '../store_common.compoennt';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-store-lose',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './store-lose.component.html',
  styleUrls: ['./store-lose.component.css']
})
export class StoreLoseComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  loseFrom: FormGroup;
  constructor(
    private fb: FormBuilder,
    public message: NzMessageService,
  ) {
    super();
    this.searchArray = [
      {key: 'goods_name', index: 0, name: '商品名称', show: true},
      {key: 'data.operator_account', index: 5, name: '操作人', show: true},
      {key: 'effect_datfrom', index: 3, name: '报损时间起', show: false, isTime: true},
      {key: 'effect_dateto', index: 4, name: '报损时间止', show: false, isTime: true}
    ];
    this.loseFrom = this.fb.group({
      id: [{value: '', disabled: false}],
      name: [{value: '', disabled: false}, [Validators.required]],
      type: [{value: '', disabled: false}, [Validators.required]],
      license_code: [{value: '', disabled: false}, [Validators.required]],
      address: [{value: '', disabled: false}],
      operator: [{value: '', disabled: false}, [Validators.required]],
      contact_name: [{value: '', disabled: false}],
      tontact_phone: [{value: '', disabled: false}, ],
      desc: [{value: '', disabled: false}],
    });
   }

  ngOnInit() {
    this.listLoading = false;
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

  // 新增
  add() {
    this.OpenDraw = true;
    this.formTitle = '供应商新增';
    this.loseFrom.reset();
  }
  dataBack(msg) {
    if (msg.status) {
      for (const i in this.loseFrom.controls) {
        if (i) {
          this.loseFrom.controls[i].markAsDirty();
          this.loseFrom.controls[i].updateValueAndValidity();
        }
      }
      if (this.loseFrom.value.name === null || this.loseFrom.value.name === '') {
        this.message.create('error', '供应商名称不能为空');
        return;
      }
      if (this.loseFrom.value.type === null || this.loseFrom.value.type === '') {
        this.message.create('error', '合作类型不能为空');
        return;
      }
      if (this.loseFrom.value.operator === null || this.loseFrom.value.operator === '') {
        this.message.create('error', '负责人不能为空');
        return;
      }
      // this.saveSupplier();
    } else {
      this.OpenDraw = false;
    }
  }
}
