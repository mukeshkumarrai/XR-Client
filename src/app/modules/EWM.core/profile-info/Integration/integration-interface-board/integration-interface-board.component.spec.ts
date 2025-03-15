import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationInterfaceBoardComponent } from './integration-interface-board.component';

describe('IntegrationInterfaceBoardComponent', () => {
  let component: IntegrationInterfaceBoardComponent;
  let fixture: ComponentFixture<IntegrationInterfaceBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationInterfaceBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationInterfaceBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
