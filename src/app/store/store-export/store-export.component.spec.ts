import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreExportComponent } from './store-export.component';

describe('StoreExportComponent', () => {
  let component: StoreExportComponent;
  let fixture: ComponentFixture<StoreExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
