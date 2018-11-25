import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shopfront',
  templateUrl: './shopfront.component.html',
  styleUrls: ['./shopfront.component.less']
})
export class ShopfrontComponent extends MaterialCommon implements OnInit {
  dataList: any;
  shopFrontForm: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    super();
    // 查询条件
    this.searchArray = [
      {key: 'name', index: 0, name: '店铺名称', show: true},
    ];
   }

  ngOnInit() {
    this.listLoading = false;
    this.shopFrontForm = this.fb.group({
      name: [{ value: '', disabled: false }, [Validators.required]],
      type: [{ value: '', disabled: false }, [Validators.required]],
      shopkeeper: [{ value: '', disabled: false }, [Validators.required]],
      keeperphone: [{ value: '', disabled: false }, [Validators.required]],
      address: [{ value: '', disabled: false }, [Validators.required]],
      num: [{ value: '', disabled: false }, [Validators.required]],
    });
  }
  // 数据查询
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
    this.searchStream.next();
  }
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
  // 弹出模态框
  addshop() {
    this.OpenDraw = true;
    this.formTitle = '店面新增';
  }
  dataBack(msg) {
    if (msg.status) {

    } else {
      this.OpenDraw = false;
    }
  }

}
