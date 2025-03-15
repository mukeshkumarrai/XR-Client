import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFolderFilterComponent } from './candidate-folder-filter.component';

describe('CandidateFolderFilterComponent', () => {
  let component: CandidateFolderFilterComponent;
  let fixture: ComponentFixture<CandidateFolderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateFolderFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFolderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
