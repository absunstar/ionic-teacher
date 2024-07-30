import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookViewPage } from './book-view.page';

describe('BookViewPage', () => {
  let component: BookViewPage;
  let fixture: ComponentFixture<BookViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
