import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingUserComponent } from './tracking-user.component';

describe('TrackingUserComponent', () => {
  let component: TrackingUserComponent;
  let fixture: ComponentFixture<TrackingUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingUserComponent]
    });
    fixture = TestBed.createComponent(TrackingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
