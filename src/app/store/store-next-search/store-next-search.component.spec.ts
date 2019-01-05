import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreNextSearchComponent } from './store-next-search.component';

describe('StoreNextSearchComponent', () => {
  let component: StoreNextSearchComponent;
  let fixture: ComponentFixture<StoreNextSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreNextSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreNextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
