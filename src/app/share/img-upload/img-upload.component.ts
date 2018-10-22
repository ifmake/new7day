import { Component, OnInit, Output, EventEmitter, Input, OnChanges, DoCheck } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
declare var OSS: any;

@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.css']
})
export class ImgUploadComponent implements OnInit , DoCheck {
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  @Input() ImgUrl: string;
  private callData = {
    imgUrl: '',
  };

  // 图片上传配置
  fileList = [];
  previewImage = '';
  previewVisible = false;
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
    // 删除图片
    removeImg = (remove) =>  {
      this.fileList = [];
      this.callBack.emit(this.callData);
    }

  constructor(
    private msg: NzMessageService
  ) {
  }
  ngOnInit() {
  }
  ngDoCheck() {
    if (this.ImgUrl !== '' && this.ImgUrl !== null) {
      this.fileList = [
        {
          message: '',
          uid: 121,
          name: 'xxx.png',
          status: 'done',
          url: this.ImgUrl,
          response: '{"status": "success"}',
        }
      ];
    } else {
      this.fileList = [];
    }
  }
  // 图片上传
  uploadImg(imgObj) {
    if (!imgObj.fileList[0]) {
      return false;
    }
    const file = imgObj.file;
    const {name} = file;
    if (!/(.+)(\.git|\.jpeg|\.png|.jpg|\.bmp)/i.test(name)) {
        this.msg.create('warning', '图片格式不正确');
        return false;
    }
    const storeImage = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId: 'LTAIYMdVVBM1Uzj2',
      accessKeySecret: 'v6zlAlinTrFR0DHiWf7upkhZWAxbfg',
      bucket: 'new7day'
    });
    const key = new Date().getTime() + name;
    storeImage.multipartUpload(key, file.originFileObj).then(res => {
      if (res.res.status === 200) {
        this.previewImage = res.res.requestUrls[0].split('?')[0];
        this.callData.imgUrl = this.previewImage;
        this.callBack.emit(this.callData);
      } else {
        this.msg.create('error', '图片上传失败');
      }
    });
  }

}
