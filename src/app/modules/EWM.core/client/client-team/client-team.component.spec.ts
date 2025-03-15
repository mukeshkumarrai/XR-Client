import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTeamComponent } from './client-team.component';

describe('ClientTeamComponent', () => {
  let component: ClientTeamComponent;
  let fixture: ComponentFixture<ClientTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
