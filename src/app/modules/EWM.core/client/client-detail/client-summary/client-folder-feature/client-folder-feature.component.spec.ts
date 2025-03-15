import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFolderFeatureComponent } from './client-folder-feature.component';

describe('ClientFolderFeatureComponent', () => {
  let component: ClientFolderFeatureComponent;
  let fixture: ComponentFixture<ClientFolderFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFolderFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFolderFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
