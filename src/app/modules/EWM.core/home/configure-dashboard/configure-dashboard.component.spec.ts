import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureDashboardComponent } from './configure-dashboard.component';

describe('configureDashboardComponent', () => {
  let component: configureDashboardComponent;
  let fixture: ComponentFixture<configureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ configureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(configureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
