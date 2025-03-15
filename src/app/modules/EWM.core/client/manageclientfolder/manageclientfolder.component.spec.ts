import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageclientfolderComponent } from './manageclientfolder.component';

describe('ManageclientfolderComponent', () => {
  let component: ManageclientfolderComponent;
  let fixture: ComponentFixture<ManageclientfolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageclientfolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageclientfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
