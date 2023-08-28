import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrrtimeComponent } from './brrtime.component';

describe('BrrtimeComponent', () => {
  let component: BrrtimeComponent;
  let fixture: ComponentFixture<BrrtimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrrtimeComponent]
    });
    fixture = TestBed.createComponent(BrrtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
