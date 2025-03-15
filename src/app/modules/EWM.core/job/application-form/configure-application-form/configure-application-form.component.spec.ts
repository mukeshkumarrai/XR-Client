import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureApplicationFormComponent } from './configure-application-form.component';

describe('ConfigureApplicationFormComponent', () => {
  let component: ConfigureApplicationFormComponent;
  let fixture: ComponentFixture<ConfigureApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
