import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingDataListComponent } from './mapping-data-list.component';

describe('MappingDataListComponent', () => {
  let component: MappingDataListComponent;
  let fixture: ComponentFixture<MappingDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
