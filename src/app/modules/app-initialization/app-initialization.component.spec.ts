import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInitializationComponent } from './app-initialization.component';

describe('AppInitializationComponent', () => {
  let component: AppInitializationComponent;
  let fixture: ComponentFixture<AppInitializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppInitializationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInitializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
