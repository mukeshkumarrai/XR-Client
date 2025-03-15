import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobCategoryComponent } from './client-job-category.component';

describe('ClientJobCategoryComponent', () => {
  let component: ClientJobCategoryComponent;
  let fixture: ComponentFixture<ClientJobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientJobCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientJobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
