import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniBooksPage } from './mini-books.page';

describe('MiniBooksPage', () => {
  let component: MiniBooksPage;
  let fixture: ComponentFixture<MiniBooksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
