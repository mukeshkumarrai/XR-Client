import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPageRenameComponent } from './cover-page-rename.component';

describe('CoverPageRenameComponent', () => {
  let component: CoverPageRenameComponent;
  let fixture: ComponentFixture<CoverPageRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverPageRenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPageRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
