import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LecturesViewPage } from './lectures-view.page';

describe('LecturesViewPage', () => {
  let component: LecturesViewPage;
  let fixture: ComponentFixture<LecturesViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturesViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
