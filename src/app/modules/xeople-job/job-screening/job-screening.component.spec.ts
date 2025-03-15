import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobScreeningComponent } from './job-screening.component';


describe('JobScreeningComponent', () => {
  let component: JobScreeningComponent;
  let fixture: ComponentFixture<JobScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobScreeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
