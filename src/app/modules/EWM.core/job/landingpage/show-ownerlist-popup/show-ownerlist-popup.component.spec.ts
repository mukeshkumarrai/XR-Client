/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 19-July-2021
  @Why: EWM-2086
  @What:  This page will be use for owner popup page Component ts file
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowOwnerlistPopupComponent } from './show-ownerlist-popup.component';

describe('ShowOwnerlistPopupComponent', () => {
  let component: ShowOwnerlistPopupComponent;
  let fixture: ComponentFixture<ShowOwnerlistPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOwnerlistPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOwnerlistPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
