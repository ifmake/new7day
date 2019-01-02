import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() seachArray: any;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  validateForm: FormGroup;
  isCollapse = true;
  dateFormat: string;

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.seachArray.forEach((c, index) => {
      c.show = this.isCollapse ? (index < 3) : true;
    });
  }
  resetForm(): void {
    this.validateForm.reset();
    this.searchData();
  }
  constructor(private fb: FormBuilder) {
    this.dateFormat = 'yyyy-MM-DD';
  }

  ngOnInit() {
    this.validateForm = this.fb.group({});
    for (let i = 0; i < this.seachArray.length ; i++) {
      this.validateForm.addControl(this.seachArray[i].key, new FormControl(this.seachArray[i].value || ''));
    }
    this.seachArray.forEach((c, index) => {
      c.show = this.isCollapse ? (index < 3) : true;
    });
  }
  // 数据查询
  searchData() {
    for (const key in this.validateForm.value) {
      if (this.validateForm.value[key] === null ) {
        this.validateForm.value[key] = '';
      }
    }
    this.callBack.emit(this.validateForm.value);
  }

}
