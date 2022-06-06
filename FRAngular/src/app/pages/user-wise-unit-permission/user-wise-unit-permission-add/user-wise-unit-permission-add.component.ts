import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable, of } from "rxjs";
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UnitService } from '../../services/unit.service';
import { UserWiseUnitPermissionService } from '../../services/user-wise-unit-permission.service';

@Component({
  selector: 'app-user-wise-unit-permission-add',
  templateUrl: './user-wise-unit-permission-add.component.html',
  styleUrls: ['./user-wise-unit-permission-add.component.scss']
})
export class UserWiseUnitPermissionAddComponent implements OnInit {

  form!: FormGroup;
  filteredUserID?: Observable<any>;
  userID2!: FormControl;
  unitDropdown: any;
  allUnitDropdown: any;
  users:any;
  allUsers:any;

  constructor(private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    private userService: UserService,
    public unitService: UnitService,
    public userWiseUnitPermissionService: UserWiseUnitPermissionService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', Validators.compose([Validators.required])],
      unitId: ['', Validators.compose([Validators.required])]
    })

    if (this.data) {
      this.userId?.patchValue(this.data.userId)
      this.unitId?.patchValue(this.data.unitId)
    }
    this.getUnitDropdown();
    this.getAllActiveUserDropdown();
  }
  getAllActiveUserDropdown = (): void => {
    this.userService.getAllActiveUserForDropdown().subscribe((res) => {
      this.users = res.apiData;
      this.allUsers = res.apiData;
    });
  }
  getUnitDropdown = (): void => {
    this.unitService.getAllUnit().subscribe((res) => {
      this.unitDropdown = res.apiData;
      this.allUnitDropdown = res.apiData;
    });
  }
  get userId() {
    return this.form.get("userId")
      ;
  }
  get unitId() {
    return this.form.get("unitId");
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

  onSearchUnit(value: any) {
    this.unitDropdown = this.findUnit(value);
  }

  findUnit(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allUnitDropdown.filter((option:any) =>
        option.roleName.toLowerCase().includes(filter)
      );
    } else {
      return this.allUnitDropdown;
    }
  }

  onSubmit() {
    const addUserWiseUnitPermissionObj: any = {
      userId: this.form.value.userId,
      unitId: this.form.value.unitId
    }
    if (this.data) {
      addUserWiseUnitPermissionObj.unitPermissionId = this.data.unitPermissionId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.userWiseUnitPermissionService.addUserWiseUnitPermission(addUserWiseUnitPermissionObj).subscribe(
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
      this.userWiseUnitPermissionService.updateUserWiseUnitPermission(addUserWiseUnitPermissionObj).subscribe(
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
