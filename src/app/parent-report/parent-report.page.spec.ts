import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentReportPage } from './parent-report.page';

describe('ParentReportPage', () => {
  let component: ParentReportPage;
  let fixture: ComponentFixture<ParentReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
