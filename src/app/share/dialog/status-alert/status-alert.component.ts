import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-status-alert',
  templateUrl: './status-alert.component.html',
  styleUrls: ['./status-alert.component.css']
})
export class StatusAlertComponent implements OnInit, OnChanges {
  @Input() type: string;
  constructor() { }

  ngOnInit() {}
  ngOnChanges() {
    setTimeout(() => {
      this.type = '';
    }, 2000);
  }

}
