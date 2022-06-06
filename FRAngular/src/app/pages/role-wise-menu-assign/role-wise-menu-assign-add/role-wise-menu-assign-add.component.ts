import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { RoleWiseMenuAssign } from '../../models/application.model';
import { RoleWiseMenuAssignService } from '../../services/role-wise-menu-assign.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from '../../services/role.service';
import { MenuService } from '../../services/menu.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'role-wise-menu-assign-add',
  templateUrl: './role-wise-menu-assign-add.component.html',
  styleUrls: ['./role-wise-menu-assign-add.component.scss'],
})
export class RoleWiseMenuAssignAddComponent implements OnInit {
  form!: FormGroup;
  roleDropdown: any;
  allRoleDropdown: any;
  menuDropdown: any;
  allMenuDropdown: any;
  roleWiseMenuAssignList: RoleWiseMenuAssign[] = [];
  roleWiseMenuAssign = {
    createYn: 'N',
    editYn: 'N',
    viewDetailYn: 'N',
    deleteYn: 'N',
    authYn: 'N'
  };
  serial: number = 1;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public roleWiseMenuAssignService: RoleWiseMenuAssignService,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<any>,
    public roleService: RoleService,
    public menuService: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      roleId: [''],
      menuId: [''],
      createYn: [''],
      editYn: [''],
      viewDetailYn: [''],
      deleteYn: [''],
      authYn: [''],
    });
    if (this.data) {
      this.roleId?.patchValue(this.data.roleId);
      this.create?.patchValue(this.data.createYn == "Y" ? true : false);
      this.viewDetail?.patchValue(this.data.viewDetailYn == "Y" ? true : false);
      this.authorization?.patchValue(this.data.authYn == "Y" ? true : false);
      this.edit?.patchValue(this.data.editYn == "Y" ? true : false);
      this.delete?.patchValue(this.data.deleteYn == "Y" ? true : false);
    }
    this.getRoleDropdown();
    if(this.data)
    {
      this.getMenuByRoleIdWithEditedMenu(this.data.roleId, this.data.menuId);
    }
  }

  getRoleDropdown = (): void => {
    this.roleService.getRoleForDropdown().subscribe((res) => {
      this.roleDropdown = res.apiData;
      this.allRoleDropdown = res.apiData;
    });
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

  onSearchMenu(value: any) {
    this.menuDropdown = this.findMenu(value);
  }

  findMenu(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allMenuDropdown.filter((option:any) =>
        option.menuName.toLowerCase().includes(filter)
      );
    } else {
      return this.allMenuDropdown;
    }
  }

  get roleId() {
    return this.form.get('roleId');
  }
  get menuId() {
    return this.form.get('menuId');
  }
  get create() {
    return this.form.get('createYn');
  }
  get edit() {
    return this.form.get('editYn');
  }
  get viewDetail() {
    return this.form.get('viewDetailYn');
  }
  get delete() {
    return this.form.get('deleteYn');
  }
  get authorization() {
    return this.form.get('authYn');
  }

  getMenuByRoleId(value: any) {
    this.menuService.getNonMatchMenuByRoleDropdown(value).subscribe((res) => {
      this.menuDropdown = res.apiData;
      this.allMenuDropdown = res.apiData;
    });
  }

  getMenuByRoleIdWithEditedMenu(roleId: any, menuId: any) {
    this.menuService.getNonMatchMenuByRoleWithSelectedMenuDropdown(roleId, menuId).subscribe((res) => {
      this.menuDropdown = res.apiData;
      this.allMenuDropdown = res.apiData;
      this.menuId?.patchValue(this.data.menuId);
    });
  }

  Create(id: any) {
    const x = id ? 'Y' : 'N';
    this.roleWiseMenuAssign.createYn = x;
  }
  Edit(id: any) {
    const x = id ? 'Y' : 'N';
    this.roleWiseMenuAssign.editYn = x;
  }
  View_Detail(id: any) {
    const x = id ? 'Y' : 'N';
    this.roleWiseMenuAssign.viewDetailYn = x;
  }
  Delete(id: any) {
    const x = id ? 'Y' : 'N';
    this.roleWiseMenuAssign.deleteYn = x;
  }
  Authorization(id: any) {
    const x = id ? 'Y' : 'N';
    this.roleWiseMenuAssign.authYn = x;
  }

  add() {
    if (this.form.valid) {
      let existData = this.roleWiseMenuAssignList.find((x:any) => x.roleId == this.form.value.roleId && x.menuId == this.form.value.menuId);
      if(existData)
      {
        this.commonService.showErrorMsg('Selected menu is already assigned to selected role in below list !');
        return;
      }
      else
      {
        const roleWiseMenuAssign = {
          serial: this.serial++,
          roleId: this.form.value.roleId,
          roleName: this.allRoleDropdown.find((option:any) => option.roleId == this.form.value.roleId).roleName,
          menuId: this.form.value.menuId,
          menuName: this.allMenuDropdown.find((option:any) => option.menuId == this.form.value.menuId).menuName,
          createYn: this.roleWiseMenuAssign.createYn,
          editYn: this.roleWiseMenuAssign.editYn,
          viewDetailYn: this.roleWiseMenuAssign.viewDetailYn,
          deleteYn: this.roleWiseMenuAssign.deleteYn,
          authYn: this.roleWiseMenuAssign.authYn
        };
        this.roleWiseMenuAssignList.push(roleWiseMenuAssign);
        return;
      }
    }
  }

  deleteFromTable(serial: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.roleWiseMenuAssignList = this.roleWiseMenuAssignList.filter(item => item.serial != serial);
      }
    })
  }

  onSubmit() {
    if (this.form.valid && !this.data) {
      this.asyncService.start();
      this.roleWiseMenuAssignService.addrolewiseMenuAssign(this.roleWiseMenuAssignList).subscribe(
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
          this.commonService.showErrorMsg(JSON.stringify(error));
        }
      );
    }
    if (this.form.valid && this.data) {
      this.asyncService.start();
      const roleWiseMenuAssign = {
        roleWiseMenuAssignId: this.data.roleWiseMenuAssignId,
        roleId: this.data.roleId,
        menuId: this.data.menuId,
        createYn: this.form.value.createYn == true ? "Y" : "N",
        editYn: this.form.value.editYn == true ? "Y" : "N",
        viewDetailYn: this.form.value.viewDetailYn == true ? "Y" : "N",
        deleteYn: this.form.value.deleteYn == true ? "Y" : "N",
        authYn: this.form.value.authYn == true ? "Y" : "N"
      };
      this.roleWiseMenuAssignService.updateRoleWiseMenuAssign(roleWiseMenuAssign).subscribe(
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
          this.commonService.showErrorMsg(JSON.stringify(error));
        }
      );
    }
  }
}
