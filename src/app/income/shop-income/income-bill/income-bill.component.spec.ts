import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeBillComponent } from './income-bill.component';

describe('IncomeBillComponent', () => {
  let component: IncomeBillComponent;
  let fixture: ComponentFixture<IncomeBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
