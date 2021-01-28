import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutResultComponent } from './checkout-result.component';

describe('CheckoutResultComponent', () => {
  let component: CheckoutResultComponent;
  let fixture: ComponentFixture<CheckoutResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
