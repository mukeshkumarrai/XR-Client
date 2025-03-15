import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAddressComponent } from './candidate-address.component';

describe('CandidateAddressComponent', () => {
  let component: CandidateAddressComponent;
  let fixture: ComponentFixture<CandidateAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
