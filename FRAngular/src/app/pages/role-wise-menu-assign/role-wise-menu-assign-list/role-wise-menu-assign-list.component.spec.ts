import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseMenuAssignListComponent } from './role-wise-menu-assign-list.component';

describe('RoleWiseMenuAssignListComponent', () => {
  let component: RoleWiseMenuAssignListComponent;
  let fixture: ComponentFixture<RoleWiseMenuAssignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleWiseMenuAssignListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWiseMenuAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
