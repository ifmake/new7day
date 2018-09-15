import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreImportComponent } from './store-import.component';

describe('StoreImportComponent', () => {
  let component: StoreImportComponent;
  let fixture: ComponentFixture<StoreImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
