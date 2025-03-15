import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientContactComponent } from './manage-client-contact.component';

describe('ManageClientContactComponent', () => {
  let component: ManageClientContactComponent;
  let fixture: ComponentFixture<ManageClientContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClientContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
