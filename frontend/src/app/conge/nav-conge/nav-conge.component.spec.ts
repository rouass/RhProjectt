import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCongeComponent } from './nav-conge.component';

describe('NavCongeComponent', () => {
  let component: NavCongeComponent;
  let fixture: ComponentFixture<NavCongeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavCongeComponent]
    });
    fixture = TestBed.createComponent(NavCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
