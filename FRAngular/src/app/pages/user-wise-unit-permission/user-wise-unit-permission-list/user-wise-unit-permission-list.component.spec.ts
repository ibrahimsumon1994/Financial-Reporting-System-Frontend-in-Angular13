import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseUnitPermissionListComponent } from './user-wise-unit-permission-list.component';

describe('UserWiseUnitPermissionListComponent', () => {
  let component: UserWiseUnitPermissionListComponent;
  let fixture: ComponentFixture<UserWiseUnitPermissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseUnitPermissionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseUnitPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
