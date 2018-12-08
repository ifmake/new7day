import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFinalComponent } from './shop-final.component';

describe('ShopFinalComponent', () => {
  let component: ShopFinalComponent;
  let fixture: ComponentFixture<ShopFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
