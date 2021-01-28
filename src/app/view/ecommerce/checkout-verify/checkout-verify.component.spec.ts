import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutVerifyComponent } from './checkout-verify.component';

describe('CheckoutVerifyComponent', () => {
  let component: CheckoutVerifyComponent;
  let fixture: ComponentFixture<CheckoutVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
