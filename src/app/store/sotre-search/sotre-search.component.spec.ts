import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SotreSearchComponent } from './sotre-search.component';

describe('SotreSearchComponent', () => {
  let component: SotreSearchComponent;
  let fixture: ComponentFixture<SotreSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SotreSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SotreSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
