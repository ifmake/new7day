import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCostComponent } from './store-cost.component';

describe('StoreCostComponent', () => {
  let component: StoreCostComponent;
  let fixture: ComponentFixture<StoreCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
