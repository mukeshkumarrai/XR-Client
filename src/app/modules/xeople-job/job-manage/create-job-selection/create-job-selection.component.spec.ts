import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateJobSelectionComponent } from './create-job-selection.component';

describe('CreateJobSelectionComponent', () => {
  let component: CreateJobSelectionComponent;
  let fixture: ComponentFixture<CreateJobSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
