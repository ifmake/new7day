import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MaterialCommon } from '../material.common';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../../common/service/product.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SupplierService } from '../../common/service/supplier.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends MaterialCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;

  // 新增商品表单
  prodcutForm: FormGroup;
  constructor(
    public message: NzMessageService,
    private productService: ProductService,
    private fb: FormBuilder,
  ) {
    super();
    // 数据列表查询
    this.searchStream.pipe(switchMap(() => {
      return this.productService.getProductList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
      console.log(this.dataList.count);
    });
    this.searchArray = [
      {key: 'name', index: 0, name: '名称', show: true},
      {key: 'code', index: 1, name: '编码', show: true},
      {key: 'spec', index: 2, name: '规格', show: true},
      {key: 'search', index: 2, name: '模糊查询', show: true},
    ];
    // 新增商品表单
    this.prodcutForm = this.fb.group({
      name: [{value: '', disabled: false}, [Validators.required]],
      short_name: [{value: '', disabled: false}, [Validators.required]],
      id: [{value: '', disabled: false}],
      code: [{value: '', disabled: false}],
      in_price: [{value: '', disabled: false}],
      sale_price: [{value: '', disabled: false}],
      unit: [{value: '', disabled: false}, [Validators.required]],
      brand: [{value: '', disabled: false}],
      img: [{value: '', disabled: false}],
      desc: [{value: '', disabled: false}],
    });
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
  // 数据查询
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
  // 新增
  add() {
    this.OpenDraw = true;
    this.formTitle = '商品新增';
    this.prodcutForm.reset();
  }
  // 确认添加
  dataBack(msg) {
    if (msg.status) {
      for (const i in this.prodcutForm.controls) {
        if (i) {
          this.prodcutForm.controls[i].markAsDirty();
          this.prodcutForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.prodcutForm.value.name === null || this.prodcutForm.value.name === '') {
        this.message.create('error', '商品名称不能为空');
        return;
      }
      if (this.prodcutForm.value.short_name === '' || this.prodcutForm.value.short_name === null) {
        this.message.create('error', '搜索关键字不能为空');
        return;
      }
      if (this.prodcutForm.value.short_name === '' || this.prodcutForm.value.short_name === null) {
        this.message.create('error', '搜索关键字不能为空');
        return;
      }
      if (this.prodcutForm.value.unit === '' || this.prodcutForm.value.unit === null) {
        this.message.create('error', '规格不能为空');
        return;
      }
      this.saveProduct();
    } else {
      this.OpenDraw = false;
    }
  }
  // 保存商品
  saveProduct() {
    if (!this.prodcutForm.value.id || this.prodcutForm.value.id === '' ) {
      this.productService.createProduct(this.prodcutForm.value).subscribe((res) => {
        if (!res.error) {
          this.OpenDraw = false;
          this.message.create('success', '新建成功');
          this.searchStream.next();
        } else {
          this.errorAlert(res);
        }
      });
    } else {
      this.productService.reviseProduct(this.prodcutForm.value.id, this.prodcutForm.value).subscribe(res => {
        if (!res.error) {
          this.OpenDraw = false;
          this.searchStream.next();
          this.message.create('success', '修改成功');
        } else {
          this.errorAlert(res);
        }
      });
    }
  }
  // 删除商品
  deleteProduct(status, id) {
    if (status.type) {
      this.productService.deleteProduct(id).subscribe(res => {
        this.searchStream.next();
        this.message.info('删除成功');
      });
    } else {
      this.message.info('取消删除');
    }
  }
  // 查看商品资料
  reviseDetail(id) {
    this.OpenDraw = true;
    this.formTitle = '商品修改';
    this.productService.getProductDetail(id).subscribe(res => {
      console.log(res);
      const {
        id = '',
        name = '',
        short_name = '',
        code = '',
        in_price = '',
        sale_price = '',
        unit = '',
        brand = '',
        img = '',
        desc = ''} = res;
        this.prodcutForm.setValue({id, name, short_name, code, in_price, sale_price, unit,  brand , img, desc});
    });
  }


  }

