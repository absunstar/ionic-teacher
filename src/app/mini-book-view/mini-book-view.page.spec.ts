import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniBookViewPage } from './mini-book-view.page';

describe('MiniBookViewPage', () => {
  let component: MiniBookViewPage;
  let fixture: ComponentFixture<MiniBookViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBookViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
