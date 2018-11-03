import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRecordComponent } from './store-record.component';

describe('StoreRecordComponent', () => {
  let component: StoreRecordComponent;
  let fixture: ComponentFixture<StoreRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
