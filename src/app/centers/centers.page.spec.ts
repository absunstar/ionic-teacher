import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentersPage } from './centers.page';

describe('CentersPage', () => {
  let component: CentersPage;
  let fixture: ComponentFixture<CentersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CentersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
