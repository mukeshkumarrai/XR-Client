import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateFolderComponent } from './manage-candidate-folder.component';

describe('ManageCandidateFolderComponent', () => {
  let component: ManageCandidateFolderComponent;
  let fixture: ComponentFixture<ManageCandidateFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
