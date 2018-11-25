import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../common/service/account.service';
import { switchMap } from 'rxjs/operators';
import { Tree } from '@angular/router/src/utils/tree';
import { StoreService } from '../../common/service/store.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent extends MaterialCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  accountForm: FormGroup;
  constructor(
    public message: NzMessageService,
    private accountService: AccountService,
    private storeService: StoreService,
    private fb: FormBuilder,
  ) {
    super();
    // 获取列表数据
    this.searchStream.pipe(switchMap(() => {
      return this.accountService.getAccountList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });
    this.searchArray = [
      {key: 'name', index: 0, name: '姓名', show: true},
      {key: 'code', index: 1, name: '员工编号', show: true},
    ];
  }

  ngOnInit() {
    // 表单数据
    this.accountForm = this.fb.group({
      id: [{ value: '', disabled: false }],
      name: [{ value: '', disabled: false }, [Validators.required]],
      phone: [{ value: '', disabled: false }, [Validators.required]],
      role: [{ value: '', disabled: false }, [Validators.required]],
      code: [{ value: '', disabled: false }, [Validators.required]],
      address: [{ value: '', disabled: false }],
      salary: [{ value: '1500', disabled: false }],
      depot: [{ value: '', disabled: false }],
      gender: [{ value: 1, disabled: false }],
      desc: [{ value: '', disabled: false }],
    });
    this.searchStream.next();
    this.getStoreList();
  }
  // 接口错误提示
  errorAlert(errors) {
    console.log(errors);
    for (const err of errors.error.code) {
        this.message.create('error', err);
    }
  }
  // 数据查询
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
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
  // 新增
  add() {
    this.OpenDraw = true;
    this.formTitle = '员工添加';
    this.accountForm.reset();
    this.accountForm.patchValue({gender: 1});
  }
  // 查看资料
  reviseDetail(id) {
    this.OpenDraw = true;
    this.formTitle = '员工资料修改';
    this.accountService.getAccountDetail(id).subscribe(res => {
      const {
        id = '',
        name = '',
        phone = '',
        address = '',
        code = '',
        salary = '',
        depot = '',
        gender = '',
        role = '',
        desc = ''} = res;
        this.accountForm.setValue({id, name,  phone, code, salary, address, role, depot, gender, desc});
    });
  }
  // 确认添加
  dataBack(msg) {
    if (msg.status) {
      for (const i in this.accountForm.controls) {
        if (i) {
          this.accountForm.controls[i].markAsDirty();
          this.accountForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.accountForm.value.name === null || this.accountForm.value.name === '') {
        this.message.create('error', '员工姓名不能为空');
        return;
      }
      if (this.accountForm.value.phone === null || this.accountForm.value.phone === '') {
        this.message.create('error', '员工联系电话不能为空');
        return;
      }
      if (this.accountForm.value.role === null || this.accountForm.value.role === '') {
        this.message.create('error', '员工角色不能为空');
        return;
      }
      if (this.accountForm.value.code === null || this.accountForm.value.code === '') {
        this.message.create('error', '员工编码不能为空');
        return;
      }
      this.saveStaff();
    } else {
      this.OpenDraw = false;
    }
  }
  // 保存员工信息
  saveStaff() {
    if (!this.accountForm.value.id || this.accountForm.value.id === null) {
      this.accountService.createAccount(this.accountForm.value).subscribe(res => {
        if (!res.error) {
          this.message.create('success', '添加成功');
          this.searchStream.next();
          this.OpenDraw = false;
        } else {
         this.errorAlert(res);
        }
      });
    } else {
      this.accountService.reviseAccount(this.accountForm.value.id, this.accountForm.value).subscribe(res => {
        if (!res.error) {
          this.message.create('success', '修改成功');
          this.searchStream.next();
          this.OpenDraw = false;
        } else {
          this.errorAlert(res);
        }
      });
    }
  }
  // 获取仓库列表
  getStoreList() {
    this.storeService.getStoreList(this.searchObj).subscribe(res => {
      console.log(res);
      this.storeList = res.results;
    });
  }
  // 删除员工
  deleteStaff(status, id) {
    if (status.type) {
      this.accountService.deleteAccount(id).subscribe(res => {
        this.searchStream.next();
        this.message.info('删除成功');
      });
    } else {
      this.message.info('取消删除');
    }
  }

}
