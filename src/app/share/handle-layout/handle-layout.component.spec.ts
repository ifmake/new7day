import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleLayoutComponent } from './handle-layout.component';

describe('HandleLayoutComponent', () => {
  let component: HandleLayoutComponent;
  let fixture: ComponentFixture<HandleLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
