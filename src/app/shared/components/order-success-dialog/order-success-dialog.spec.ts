import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccessDialog } from './order-success-dialog';

describe('OrderSuccessDialog', () => {
  let component: OrderSuccessDialog;
  let fixture: ComponentFixture<OrderSuccessDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSuccessDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSuccessDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
