
import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';
import { AccountService } from 'src/app/common/service/account.service';

@Component({
  selector: 'app-shopfront',
  templateUrl: './shopfront.component.html',
  styleUrls: ['./shopfront.component.less']
})
export class ShopfrontComponent extends MaterialCommon implements OnInit {
  dataList: any;
  shopFrontForm: FormGroup;
  searchUserObj: any;
  constructor(
    private fb: FormBuilder,
    private shopService: ShopMaterialService,
    private accountService: AccountService,
  ) {
    super();
    // 查询条件
    this.searchArray = [
      {key: 'name', index: 0, name: '店铺名称', show: true},
    ];
    this.searchUserObj = {
      page: 1,
      page_size: 100,
    };
      // 数据列表查询
      this.searchStream.pipe(switchMap(() => {
        return this.shopService.getShopMaterialList(this.searchObj);
      })).subscribe(res => {
        this.listLoading = false;
        this.dataList = res;
      });
   }

  ngOnInit() {
    this.searchStream.next();
    this.shopFrontForm = this.fb.group({
      name: [{ value: '', disabled: false }, [Validators.required]],
      type: [{ value: '', disabled: false }, [Validators.required]],
      contact_user: [{ value: '', disabled: false }, [Validators.required]],
      contact_phone: [{ value: '', disabled: false }, [Validators.required]],
      address: [{ value: '', disabled: false }, [Validators.required]],
      staff_num: [{ value: '', disabled: false }, [Validators.required]],
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
    // 获取员工
    this.accountService.getAccountList(this.searchUserObj).subscribe(res => {
      console.log(res);
      this.userList = res['results'];
    });
  }
  dataBack(msg) {
    if (msg.status) {
        console.log(msg);
        this.shopService.createShopMaterial(this.shopFrontForm.value).subscribe(res => {
          console.log(res);
          if (!res.error) {

          }
        });
    } else {
      this.OpenDraw = false;
    }
  }

}
