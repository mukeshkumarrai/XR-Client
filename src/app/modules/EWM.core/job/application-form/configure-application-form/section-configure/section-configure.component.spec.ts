import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionConfigureComponent } from './section-configure.component';

describe('SectionConfigureComponent', () => {
  let component: SectionConfigureComponent;
  let fixture: ComponentFixture<SectionConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionConfigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
