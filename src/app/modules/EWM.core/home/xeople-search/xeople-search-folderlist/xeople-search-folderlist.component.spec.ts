import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchFolderlistComponent } from './xeople-search-folderlist.component';

describe('XeopleSearchFolderlistComponent', () => {
  let component: XeopleSearchFolderlistComponent;
  let fixture: ComponentFixture<XeopleSearchFolderlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchFolderlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchFolderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
