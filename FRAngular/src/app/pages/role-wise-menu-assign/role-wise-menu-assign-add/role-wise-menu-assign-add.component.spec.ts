import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseMenuAssignAddComponent } from './role-wise-menu-assign-add.component';

describe('RoleWiseMenuAssignAddComponent', () => {
  let component: RoleWiseMenuAssignAddComponent;
  let fixture: ComponentFixture<RoleWiseMenuAssignAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleWiseMenuAssignAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWiseMenuAssignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
