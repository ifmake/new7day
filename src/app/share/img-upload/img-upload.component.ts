import { Component, OnInit } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.css']
})
export class ImgUploadComponent implements OnInit {

  // 图片上传配置
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  previewImage = '';
  previewVisible = false;
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  constructor(
    private msg: NzMessageService
  ) { }

  ngOnInit() {
  }
  // 图片上传
  uploadImg(imgObj)  {
    console.log(imgObj);
  }
}
