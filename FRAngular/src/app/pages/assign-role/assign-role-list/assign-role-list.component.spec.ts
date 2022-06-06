import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleListComponent } from './assign-role-list.component';

describe('AssignRoleListComponent', () => {
  let component: AssignRoleListComponent;
  let fixture: ComponentFixture<AssignRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRoleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
