import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NikeCareerComponent } from './nike-career.component';

describe('NikeCareerComponent', () => {
  let component: NikeCareerComponent;
  let fixture: ComponentFixture<NikeCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NikeCareerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NikeCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
