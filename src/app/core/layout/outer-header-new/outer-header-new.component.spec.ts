import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterHeaderNewComponent } from './outer-header-new.component';

describe('OuterHeaderNewComponent', () => {
  let component: OuterHeaderNewComponent;
  let fixture: ComponentFixture<OuterHeaderNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterHeaderNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterHeaderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
