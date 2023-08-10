import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationDialogComponent } from './explanation-dialog.component';

describe('ExplanationDialogComponent', () => {
  let component: ExplanationDialogComponent;
  let fixture: ComponentFixture<ExplanationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplanationDialogComponent]
    });
    fixture = TestBed.createComponent(ExplanationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
