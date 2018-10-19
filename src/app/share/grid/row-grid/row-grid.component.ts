import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-row-grid',
  templateUrl: './row-grid.component.html',
  styleUrls: ['./row-grid.component.less']
})
export class RowGridComponent implements OnInit {
  @Input() T_row: number;
  @Input() C_row: number;
  @Input() Title: string;


  constructor() { }

  ngOnInit() {
  }

}
