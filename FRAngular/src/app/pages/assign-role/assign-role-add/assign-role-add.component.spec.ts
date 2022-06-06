import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleAddComponent } from './assign-role-add.component';

describe('AssignRoleAddComponent', () => {
  let component: AssignRoleAddComponent;
  let fixture: ComponentFixture<AssignRoleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
