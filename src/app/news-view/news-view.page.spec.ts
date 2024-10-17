import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsViewPage } from './news-view.page';

describe('NewsViewPage', () => {
  let component: NewsViewPage;
  let fixture: ComponentFixture<NewsViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
