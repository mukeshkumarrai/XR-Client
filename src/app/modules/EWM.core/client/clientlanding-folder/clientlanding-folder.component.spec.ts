import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientlandingFolderComponent } from './clientlanding-folder.component';

describe('ClientlandingFolderComponent', () => {
  let component: ClientlandingFolderComponent;
  let fixture: ComponentFixture<ClientlandingFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientlandingFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientlandingFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
