import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickjobComponent } from './quickjob.component';

describe('QuickjobComponent', () => {
  let component: QuickjobComponent;
  let fixture: ComponentFixture<QuickjobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickjobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
