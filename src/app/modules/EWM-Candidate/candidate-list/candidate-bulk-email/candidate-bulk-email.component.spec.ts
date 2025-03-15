import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateBulkEmailComponent } from './candidate-bulk-email.component';

describe('CandidateBulkEmailComponent', () => {
  let component: CandidateBulkEmailComponent;
  let fixture: ComponentFixture<CandidateBulkEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateBulkEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateBulkEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
