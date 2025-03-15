import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureJobTemplateComponent } from './configure-job-template.component';

describe('ConfigureJobTemplateComponent', () => {
  let component: ConfigureJobTemplateComponent;
  let fixture: ComponentFixture<ConfigureJobTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureJobTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureJobTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
