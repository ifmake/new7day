import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBtnComponent } from './upload-btn.component';

describe('UploadBtnComponent', () => {
  let component: UploadBtnComponent;
  let fixture: ComponentFixture<UploadBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
