import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageViewPage } from './page-view.page';

describe('PageViewPage', () => {
  let component: PageViewPage;
  let fixture: ComponentFixture<PageViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
