import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAlertComponent } from './status-alert.component';

describe('StatusAlertComponent', () => {
  let component: StatusAlertComponent;
  let fixture: ComponentFixture<StatusAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
