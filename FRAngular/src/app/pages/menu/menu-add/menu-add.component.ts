import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconList } from 'src/app/shared/models/icon-list';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MenuService } from '../../services/menu.service';
import { CommonCodeService } from '../../services/common-code.service';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent implements OnInit {
  form!: FormGroup;
  menuIconDropdown: any;
  allMenuTypeDropdown: any;
  menuTypeDropdown: any;
  allParentMenuDropdown: any;
  parentMenuDropdown: any;
  constructor(
    private fb: FormBuilder,
    private iconListModel: IconList,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public menuService: MenuService,
    public dialogRef: MatDialogRef<any>,
    public commonCodeService: CommonCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.menuIconDropdown = this.iconListModel.iconList;
    this.form = this.fb.group({
      menuName: ['', Validators.compose([Validators.required])],
      menuLocation: ['', Validators.compose([Validators.required])],
      menuTypeId: ['', Validators.compose([Validators.required])],
      reportPath: [''],
      parentId: [0],
      menuSequence: ['', Validators.compose([Validators.required])],
      menuIcon: ['', Validators.compose([Validators.required])],
    })
    if (this.data) {
      this.menuName?.patchValue(this.data.menuName);
      this.menuLocation?.patchValue(this.data.menuLocation);
      this.menuTypeId?.patchValue(this.data.menuTypeId);
      this.reportPath?.patchValue(this.data.reportPath);
      this.parentId?.patchValue(this.data.parentId);
      this.menuSequence?.patchValue(this.data.menuSequence);
      this.menuIcon?.patchValue(this.data.menuIcon);
    }
    this.getMenuTypeDropdown();
    this.getParentMenuDropdown();
  }

  getParentMenuDropdown = (): void => {
    this.menuService.getParentMenuForDropdown().subscribe((res) => {
      if(this.data)
      {
        if(res.apiData)
        {
          this.parentMenuDropdown = res.apiData.filter((option:any) =>
            option.menuId !== this.data.menuId
          );
          this.allParentMenuDropdown = this.parentMenuDropdown;
        }
      }
      else
      {
        this.parentMenuDropdown = res.apiData;
        this.allParentMenuDropdown = res.apiData;
      }
    });
  }

  getMenuTypeDropdown = (): void => {
    this.commonCodeService.getCommonCodeForDropdown("MenuType").subscribe((res) => {
      this.menuTypeDropdown = res.apiData;
      this.allMenuTypeDropdown = res.apiData;
    });
  }

  onSearchParentMenu(value: any) {
    this.parentMenuDropdown = this.findParentMenu(value);
  }

  findParentMenu(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allParentMenuDropdown.filter((option:any) =>
        option.menuName.toLowerCase().includes(filter)
      );
    } else {
      return this.allParentMenuDropdown;
    }
  }

  onSearchMenuIcon(value: any) {
    this.menuIconDropdown = this.findMenuIcon(value);
  }

  findMenuIcon(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.iconListModel.iconList.filter((option:any) =>
        option.value.toLowerCase().includes(filter)
      );
    } else {
      return this.iconListModel.iconList;
    }
  }

  onSearchMenuType(value: any) {
    this.menuTypeDropdown = this.findMenuType(value);
  }

  findMenuType(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allMenuTypeDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allMenuTypeDropdown;
    }
  }
  get menuTypeId() {
    return this.form.get("menuTypeId");
  }
  get reportPath() {
    return this.form.get("reportPath");
  }
  get parentId() {
    return this.form.get("parentId");
  }
  get menuName() {
    return this.form.get("menuName");
  }
  get menuLocation() {
    return this.form.get("menuLocation");
  }
  get menuSequence() {
    return this.form.get("menuSequence");
  }
  get menuIcon() {
    return this.form.get("menuIcon");
  }

  onSubmit() {
    const obj: any = {
      menuName: this.form.value.menuName,
      menuLocation: this.form.value.menuLocation,
      menuTypeId: this.form.value.menuTypeId,
      reportPath: this.form.value.reportPath,
      parentId: this.form.value.parentId,
      menuSequence: this.form.value.menuSequence,
      menuIcon: this.form.value.menuIcon
    }
    if (this.data) {
      obj.menuId = this.data.menuId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.menuService.addMenu(obj).
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
            this.commonService.showSuccessMsgForDelete('Error! Failed');
          }
        );
    }
    if (this.form.valid && this.data) {
      this.asyncService.start();
      this.menuService.updateMenu(obj).subscribe(
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
