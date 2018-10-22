import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-img-list',
  templateUrl: './img-list.component.html',
  styleUrls: ['./img-list.component.less']
})
export class ImgListComponent implements OnInit {
  @Input() imgUrl: string;

  constructor() { }

  ngOnInit() {
    if (this.imgUrl === null ) {
      this.imgUrl = '';
    }
  }

}
