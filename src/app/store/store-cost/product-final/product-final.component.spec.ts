import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFinalComponent } from './product-final.component';

describe('ProductFinalComponent', () => {
  let component: ProductFinalComponent;
  let fixture: ComponentFixture<ProductFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
