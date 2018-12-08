
import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, debounceTime } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';
import { AccountService } from 'src/app/common/service/account.service';
import { NzMessageService } from 'ng-zorro-antd';

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
    public message: NzMessageService,
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
      id: [{ value: '', disabled: false }],
      name: [{ value: '', disabled: false }, [Validators.required]],
      type: [{ value: '', disabled: false }, [Validators.required]],
      contact_user: [{ value: '', disabled: false }, [Validators.required]],
      contact_phone: [{ value: '', disabled: false }, [Validators.required]],
      address: [{ value: '', disabled: false }, [Validators.required]],
      staff_num: [{ value: '', disabled: false }, [Validators.required]],
    });
  }
  // 接口提示报错
   errorAlert(errors) {
    for (const err in errors) {
      if (err && typeof errors[err] === 'object') {
        this.message.create('error', errors[err][0]);
      }
    }
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
  addshop(id) {
    this.OpenDraw = true;
    if (id) {
      this.formTitle = '店面修改';
    } else {
      this.formTitle = '店面新增';
      this.shopFrontForm.reset();
    }
    // 获取员工
    this.accountService.getAccountList(this.searchUserObj).subscribe(res => {
      this.userList = res['results'];
    });
  }
  // 选择店面负责人
  changeStaff(staffID) {
    if (staffID) {
      this.accountService.getAccountDetail(staffID).subscribe(res => {
        this.shopFrontForm.patchValue({contact_phone: res.phone});
      });
    }
  }
  dataBack(msg) {
    if (!msg.status) {
      this.OpenDraw = false;
      return;
    }
    for (const i in this.shopFrontForm.controls) {
      if (i) {
        this.shopFrontForm.controls[i].markAsDirty();
        this.shopFrontForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.shopFrontForm.value.name) {
      this.message.create('error', '店铺名称不能为空');
      return;
    }
    if (!this.shopFrontForm.value.type) {
      this.message.create('error', '选择店铺类型');
      return;
    }
    if (!this.shopFrontForm.value.contact_phone) {
      this.message.create('error', '店铺负责人电话不能为空');
      return;
    }
    if (!this.shopFrontForm.value.address) {
      this.message.create('error', '店铺地址不能为空');
      return;
    }
    if (!this.shopFrontForm.value.staff_num) {
      this.message.create('error', '店铺员工数不能为空');
      return;
    }
    if (!this.shopFrontForm.value.id) {
        this.shopService.createShopMaterial(this.shopFrontForm.value).subscribe(res => {
          if (!res.error) {
            this.message.create('success', '操作成功');
            setTimeout(() => {
              this.OpenDraw = false;
              this.searchStream.next();
            }, 2000);
          } else {
            this.errorAlert(res.error);
          }
        });
    } else {
        this.shopService.reviseShopMaterial(this.shopFrontForm.value.id, this.shopFrontForm.value).subscribe(res => {
          if (!res.error) {
            this.message.create('success', '操作成功');
            setTimeout(() => {
              this.OpenDraw = false;
              this.searchStream.next();
            }, 2000);
          } else {
            this.errorAlert(res.error);
          }
        });
    }
  }
  // 查看店铺详情
  reviseDetail(id) {
    this.addshop(id);
    this.shopService.getShopMaterial(id).subscribe(res => {
      if (!res.error) {
        const {
          id = '',
          name = '',
          contact_phone = '',
          contact_user = 1,
          address = '',
          staff_num = '',
          type = 'direct',
        } = res;
        this.shopFrontForm.setValue({ id, name, contact_phone, contact_user, address , staff_num, type});
      } else {
        this.errorAlert(res.error);
      }
    });
  }
  // 删除店铺
  deleteStaff(ev, id) {
    console.log(ev, id);
    if (ev.type) {
      this.shopService.deleteShop(id).subscribe(res => {
        if (!res.error) {
          this.message.create('success', '删除成功');
          this.searchStream.next();
        } else {
          this.errorAlert(res.error);
        }
      });
    } else {
      this.message.info('取消删除');
    }
  }

}
