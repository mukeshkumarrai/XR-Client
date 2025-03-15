import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulitpleCandidateFolderMappingComponent } from './mulitple-candidate-folder-mapping.component';

describe('MulitpleCandidateFolderMappingComponent', () => {
  let component: MulitpleCandidateFolderMappingComponent;
  let fixture: ComponentFixture<MulitpleCandidateFolderMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulitpleCandidateFolderMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulitpleCandidateFolderMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
