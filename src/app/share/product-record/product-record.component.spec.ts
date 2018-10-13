import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecordComponent } from './product-record.component';

describe('ProductRecordComponent', () => {
  let component: ProductRecordComponent;
  let fixture: ComponentFixture<ProductRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
