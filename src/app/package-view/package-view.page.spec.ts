import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageViewPage } from './package-view.page';

describe('PackageViewPage', () => {
  let component: PackageViewPage;
  let fixture: ComponentFixture<PackageViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
