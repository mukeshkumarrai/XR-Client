import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFolderComponent } from './candidate-folder.component';

describe('CandidateFolderComponent', () => {
  let component: CandidateFolderComponent;
  let fixture: ComponentFixture<CandidateFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
