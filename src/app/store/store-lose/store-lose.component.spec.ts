import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLoseComponent } from './store-lose.component';

describe('StoreLoseComponent', () => {
  let component: StoreLoseComponent;
  let fixture: ComponentFixture<StoreLoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreLoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
