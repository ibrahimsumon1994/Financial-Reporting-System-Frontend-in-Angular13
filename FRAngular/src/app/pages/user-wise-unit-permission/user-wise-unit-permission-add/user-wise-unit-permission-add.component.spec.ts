import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseUnitPermissionAddComponent } from './user-wise-unit-permission-add.component';

describe('UserWiseUnitPermissionAddComponent', () => {
  let component: UserWiseUnitPermissionAddComponent;
  let fixture: ComponentFixture<UserWiseUnitPermissionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseUnitPermissionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseUnitPermissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
