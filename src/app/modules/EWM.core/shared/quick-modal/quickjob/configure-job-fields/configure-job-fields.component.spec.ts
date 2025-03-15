import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureJobFieldsComponent } from './configure-job-fields.component';

describe('ConfigureJobFieldsComponent', () => {
  let component: ConfigureJobFieldsComponent;
  let fixture: ComponentFixture<ConfigureJobFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureJobFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureJobFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
