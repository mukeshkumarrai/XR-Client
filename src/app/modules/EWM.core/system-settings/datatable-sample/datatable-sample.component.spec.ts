import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableSampleComponent } from './datatable-sample.component';

describe('DatatableSampleComponent', () => {
  let component: DatatableSampleComponent;
  let fixture: ComponentFixture<DatatableSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatableSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
