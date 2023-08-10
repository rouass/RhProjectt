import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeCreateComponent } from './conge-create.component';

describe('CongeCreateComponent', () => {
  let component: CongeCreateComponent;
  let fixture: ComponentFixture<CongeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongeCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
