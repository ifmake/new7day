import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotFinalComponent } from './depot-final.component';

describe('DepotFinalComponent', () => {
  let component: DepotFinalComponent;
  let fixture: ComponentFixture<DepotFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
