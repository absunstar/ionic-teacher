import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LectureViewPage } from './lecture-view.page';

describe('LectureViewPage', () => {
  let component: LectureViewPage;
  let fixture: ComponentFixture<LectureViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
