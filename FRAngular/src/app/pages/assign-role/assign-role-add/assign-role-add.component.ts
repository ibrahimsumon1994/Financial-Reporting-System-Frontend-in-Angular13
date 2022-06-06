import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AssignRoleService } from '../../services/assign-role.service';
import { Observable, of } from "rxjs";
import { startWith, debounceTime, switchMap, map } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
@Component({
  selector: 'app-assign-role-add',
  templateUrl: './assign-role-add.component.html',
  styleUrls: ['./assign-role-add.component.scss']
})
export class AssignRoleAddComponent implements OnInit {

  form!: FormGroup;
  filteredUserID?: Observable<any>;
  userID2!: FormControl;
  roleDropdown: any;
  allRoleDropdown: any;
  users:any;
  allUsers:any;

  constructor(private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    private userService: UserService,
    public roleService: RoleService,
    public assignRoleService: AssignRoleService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      userID: ['', Validators.compose([Validators.required])],
      roleID: ['', Validators.compose([Validators.required])]
    })

    if (this.data) {
      this.userID?.patchValue(this.data.userId)
      this.roleID?.patchValue(this.data.roleId)
    }
    this.getRoleDropdown();
    this.getAllActiveUserDropdown();
  }
  getAllActiveUserDropdown = (): void => {
    this.userService.getAllActiveUserForDropdown().subscribe((res) => {
      this.users = res.apiData;
      this.allUsers = res.apiData;
    });
  }
  getRoleDropdown = (): void => {
    this.roleService.getRoleForDropdown().subscribe((res) => {
      this.roleDropdown = res.apiData;
      this.allRoleDropdown = res.apiData;
    });
  }
  get userID() {
    return this.form.get("userID")
      ;
  }
  get roleID() {
    return this.form.get("roleID");
  }

  onSearchUser(value: any) {
    this.users = this.findUser(value);
  }

  findUser(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allUsers.filter((option:any) =>
        option.fullName.toLowerCase().includes(filter)
      );
    } else {
      return this.allUsers;
    }
  }

  onSearchRole(value: any) {
    this.roleDropdown = this.findRole(value);
  }

  findRole(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allRoleDropdown.filter((option:any) =>
        option.roleName.toLowerCase().includes(filter)
      );
    } else {
      return this.allRoleDropdown;
    }
  }

  onSubmit() {
    const addAssignRoleObj: any = {
      userId: this.form.value.userID,
      roleId: this.form.value.roleID
    }
    if (this.data) {
      addAssignRoleObj.roleAssignId = this.data.roleAssignId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.assignRoleService.addAssignRole(addAssignRoleObj).
        subscribe(
          (data) => {
            if (data) {
              if(data.isExecute)
              {
                this.asyncService.finish();
                this.commonService.showSuccessMsg(data.message);
                this.dialogRef.close(data);
              }
              else
              {
                this.asyncService.finish();
                this.commonService.showErrorMsg(data.message);
              }
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showSuccessMsgForDelete(JSON.stringify(error));
          }
        );
    }
    if (this.form.valid && this.data) {
      this.asyncService.start();
      this.assignRoleService.updateRoleAssign(addAssignRoleObj).
        subscribe(
          (data) => {
            if (data) {
              if(data.isExecute)
              {
                this.asyncService.finish();
                this.commonService.showSuccessMsg(data.message);
                this.dialogRef.close(data);
              }
              else
              {
                this.asyncService.finish();
                this.commonService.showErrorMsg(data.message);
              }
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showSuccessMsgForDelete(JSON.stringify(error));
          }
        );
    }
  }
}
