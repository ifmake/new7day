import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';
import { NzMessageService } from 'ng-zorro-antd';
import { StoreService } from '../../common/service/store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../common/service/account.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent extends MaterialCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  managerStr: string;
  storeForm: FormGroup;
  constructor(
    public message: NzMessageService,
    private storeService: StoreService,
    private accountService: AccountService,
    private fb: FormBuilder,
  ) {
    super();
    // 获取列表数据
    this.searchStream.pipe(switchMap(() => {
      return this.storeService.getStoreList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });
    this.searchArray = [
      {key: 'name', index: 0, name: '仓库名称', show: true},
      {key: 'type', index: 1, name: '仓库类型', show: true},
      {key: 'search', index: 1, name: '模糊查询', show: true},
    ];
    // 新增仓库
    this.storeForm = this.fb.group({
      id: [{value: '', disabled: false}],
      name: [{value: '', disabled: false}, [Validators.required]],
      type: [{value: '', disabled: false}, [Validators.required]],
      cubage: [{value: '', disabled: false}, [Validators.required]],
      depot_keepers: [{value: ['1'], disabled: false}],
      desc: [{value: '', disabled: false}],
    });
   }

  ngOnInit() {
    this.searchStream.next();
    this.getUserList();
  }
  // 接口错误提示
  errorAlert(errors) {
    for (const err in errors) {
      if (err && typeof errors[err] === 'object') {
        this.message.create('error', errors[err][0]);
      }
    }
  }
  // 获取仓库管理人
  getManagers(manages: any = []) {
    this.managerStr  = '';
    if (manages.length > 0) {
      manages.map((manger) => {
        this.managerStr += manger.name + ',';
      });
      return this.managerStr;
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
  // 删除仓库
  deleteProduct(status, id) {
    if (status.type) {
      this.storeService.deleteStore(id).subscribe(res => {
        this.searchStream.next();
        this.message.info('删除成功');
      });
    } else {
      this.message.info('取消删除');
    }
  }
  // 弹出弹窗
  add() {
    this.storeForm.reset();
    this.OpenDraw = true;
  }
  // 确认添加
  dataBack(msg) {
    if (msg.status) {
      if (!this.storeForm.value.id  || this.storeForm.value.id === '') {
        this.storeService.createStore(this.storeForm.value).subscribe(res => {
          if (!res.error) {
            this.searchStream.next();
            this.message.create('success', '添加成功');
            this.OpenDraw = false;
          } else {
            this.errorAlert(res);
          }
        });
      } else {
        this.storeService.reviseStore(this.storeForm.value.id, this.storeForm.value).subscribe(res => {
          if (!res.error) {
            this.searchStream.next();
            this.message.create('success', '修改成功');
            this.OpenDraw = false;
          } else {
            this.errorAlert(res);
          }
        });
      }
    } else {
      this.OpenDraw = false;
    }
  }
  // 获取仓库信息
  reviseDetail(id) {
    this.OpenDraw = true;
    this.formTitle = '仓库修改';
    this.storeService.getStoreDetail(id).subscribe(res => {
      console.log(res);
      const {
        id = '',
        name = '',
        type = '',
        cubage = '',
        desc = ''} = res;
        const   depot_keepers = res.depot_keepers.map(keep => keep.id);
        this.storeForm.setValue({id, name,  type, cubage, depot_keepers, desc});
        console.log(depot_keepers);
    });
  }
  // 获取所有员工列表
  getUserList() {
    this.accountService.getAccountList(this.searchObj).subscribe(res => {
      this.userList = res.results;
    });
  }

}
