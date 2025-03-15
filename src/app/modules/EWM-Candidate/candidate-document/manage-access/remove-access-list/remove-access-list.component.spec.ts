import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAccessListComponent } from './remove-access-list.component';

describe('RemoveAccessListComponent', () => {
  let component: RemoveAccessListComponent;
  let fixture: ComponentFixture<RemoveAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveAccessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
