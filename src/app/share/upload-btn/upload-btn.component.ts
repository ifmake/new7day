import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ProductService } from 'src/app/common/service/product.service';
import { LocalStorage } from 'src/app/common/storage/local.storage';

@Component({
  selector: 'app-upload-btn',
  templateUrl: './upload-btn.component.html',
  styleUrls: ['./upload-btn.component.less']
})
export class UploadBtnComponent implements OnInit {
  @Input() uploadUrl: String;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  // 文件上传
  excelUpload: any;
  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  constructor(
    private message: NzMessageService,
    public productService: ProductService,
    public storage: LocalStorage
  ) {
    this.excelUpload =  {
      'Authorization': 'JWT ' + JSON.parse(this.storage.get('loginer')).token,
    };
   }

  ngOnInit() {}
  // 文件上传之前
  uploadBefore(file) {
    if (file.name.indexOf('xlsx') === -1) {
      alert('选择正确的文件格式');
      return;
    }
  }
  // 文件上传转台变更
  listenUpload(fileObj) {
    if (fileObj.file.status !== 'uploading') {
     
      if (fileObj.file && fileObj.file.status === 'done') {
        this.message.create('success', '商品资料导入成功');
        this.callBack.emit();
      }
      if (fileObj.file && fileObj.file.status === 'error') {
        for (const  code in fileObj.file.error.error) {
          if (code) {
            this.message.create('error', fileObj.file.error.error[code][0]);
          }
        }
          this.message.create('error',fileObj.file.error.error.error?fileObj.file.error.error.error:'商品资料导入失败，请重新导入');
      }
    }
  }
}
