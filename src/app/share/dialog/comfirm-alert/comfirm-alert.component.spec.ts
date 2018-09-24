import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmAlertComponent } from './comfirm-alert.component';

describe('ComfirmAlertComponent', () => {
  let component: ComfirmAlertComponent;
  let fixture: ComponentFixture<ComfirmAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfirmAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
