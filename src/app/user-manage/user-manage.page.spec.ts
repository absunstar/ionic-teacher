import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagePage } from './user-manage.page';

describe('UserManagePage', () => {
  let component: UserManagePage;
  let fixture: ComponentFixture<UserManagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
