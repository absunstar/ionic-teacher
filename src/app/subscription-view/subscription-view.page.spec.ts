import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionViewPage } from './subscription-view.page';

describe('SubscriptionViewPage', () => {
  let component: SubscriptionViewPage;
  let fixture: ComponentFixture<SubscriptionViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
