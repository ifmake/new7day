import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.component.html',
  styleUrls: ['./record-card.component.less']
})
export class RecordCardComponent implements OnInit {
  @Input() recordListArr: any = [];
  @Input() recordType: string;
  @Input() formCard: boolean;
  @Output() recordProduct: EventEmitter<any> = new EventEmitter<any>();
  operateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.operateForm = this.fb.group({
      import_price: [{value: '', disabled: false}, [Validators.required]],
      sum: [{value: null, disabled: false}, [Validators.required]],
    });
  }

  ngOnInit() {
  }
  // 表单提交
  submitForm() {
    for (const i in this.operateForm.controls) {
      if (i) {
        this.operateForm.controls[ i ].markAsDirty();
        this.operateForm.controls[ i ].updateValueAndValidity();
      }
    }
    if (this.operateForm.valid) {
      console.log('提交确认');
    }
  }
  //  进货出货
  operateRecord(type) {
    this.recordProduct.emit(type);
  }
}
