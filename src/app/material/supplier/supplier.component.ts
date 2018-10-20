import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../common/service/supplier.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent extends MaterialCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  // 表单
  supplierFrom: FormGroup;
  constructor(
    public message: NzMessageService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
  ) {
    super();
     // 获取列表数据
     this.searchStream.pipe(switchMap(() => {
      return this.supplierService.getSupplierList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });
    // 新增供应商
    this.supplierFrom = this.fb.group({
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
    this.searchArray = [
      {key: 'name', index: 0, name: '供应商名称', show: true},
      {key: 'code', index: 1, name: '编码', show: true},
      // {key: 'search', index: 2, name: '模糊查询', show: true},
    ];
   }

  ngOnInit() {
    this.searchStream.next();
  }
    // 接口错误提示
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
    this.formTitle = '供应商新增';
    this.supplierFrom.reset();
  }
  // 供应商详细信息
   reviseDetail(id) {
    this.OpenDraw = true;
    this.formTitle = '供应商修改';
    this.supplierService.getSupplierDetail(id).subscribe(res => {
      const {
        id = '',
        name = '',
        type = '',
        license_code = '',
        address = '',
        operator = '',
        tontact_phone = '',
        contact_name = '',
        desc = ''} = res;
        this.supplierFrom.setValue({id, name,  type, license_code, contact_name, address, operator, tontact_phone, desc});
    });
  }
  // 确认添加
  dataBack(msg) {
    if (msg.status) {
      for (const i in this.supplierFrom.controls) {
        if (i) {
          this.supplierFrom.controls[i].markAsDirty();
          this.supplierFrom.controls[i].updateValueAndValidity();
        }
      }
      if (this.supplierFrom.value.name === null || this.supplierFrom.value.name === '') {
        this.message.create('error', '供应商名称不能为空');
        return;
      }
      if (this.supplierFrom.value.type === null || this.supplierFrom.value.type === '') {
        this.message.create('error', '合作类型不能为空');
        return;
      }
      if (this.supplierFrom.value.operator === null || this.supplierFrom.value.operator === '') {
        this.message.create('error', '负责人不能为空');
        return;
      }
      this.saveSupplier();
    } else {
      this.OpenDraw = false;
    }
  }
  // 保存供应商
  saveSupplier() {
    if (!this.supplierFrom.value.id || this.supplierFrom.value.id === null) {
      this.supplierService.createSupplier(this.supplierFrom.value).subscribe(res => {
        if (!res.error) {
          this.message.create('success', '添加成功');
          this.searchStream.next();
          this.OpenDraw = false;
        } else {
          this.errorAlert(res);
        }
      });
    } else {
      this.supplierService.reviseSupplier(this.supplierFrom.value.id, this.supplierFrom.value).subscribe(res => {
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
  // 删除供应商
  deleteProduct(status, id) {
    if (status.type) {
      this.supplierService.deleteSupplier(id).subscribe(res => {
        this.searchStream.next();
        this.message.info('删除成功');
      });
    } else {
      this.message.info('取消删除');
    }
  }
}
