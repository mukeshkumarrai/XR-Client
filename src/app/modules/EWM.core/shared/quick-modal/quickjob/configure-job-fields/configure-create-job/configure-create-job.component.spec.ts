import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureCreateJobComponent } from './configure-create-job.component';

describe('ConfigureCreateJobComponent', () => {
  let component: ConfigureCreateJobComponent;
  let fixture: ComponentFixture<ConfigureCreateJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureCreateJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureCreateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
