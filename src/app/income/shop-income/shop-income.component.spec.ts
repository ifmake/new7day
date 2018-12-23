import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopIncomeComponent } from './shop-income.component';

describe('ShopIncomeComponent', () => {
  let component: ShopIncomeComponent;
  let fixture: ComponentFixture<ShopIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
