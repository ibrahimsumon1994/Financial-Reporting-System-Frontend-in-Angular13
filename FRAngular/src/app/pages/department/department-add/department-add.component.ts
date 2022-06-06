import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DepartmentService } from '../../services/department.service';
import { GroupService } from '../../services/group.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent implements OnInit {
  form!: FormGroup;
  groupDropdown: any;
  allGroupDropdown: any;
  unitDropdown: any;
  allUnitDropdown: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public departmentService: DepartmentService,
    public groupService: GroupService,
    public unitService: UnitService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() : void {
    this.form = this.fb.group({
      nameBangla: ['', Validators.compose([Validators.required])],
      nameEnglish: ['', Validators.compose([Validators.required])],
      groupId: ['', Validators.compose([Validators.required])],
      unitId: ['', Validators.compose([Validators.required])]
    })
    if (this.data) {
      this.nameBangla?.patchValue(this.data.nameBangla)
      this.nameEnglish?.patchValue(this.data.nameEnglish)
      this.groupId?.patchValue(this.data.groupId)
      this.getUnitByGroupId(this.data.groupId)
      this.unitId?.patchValue(this.data.unitId)
    }
    this.getAllGroupDropdown();
  }
  clickOnGetUnitByGroupId(groupId: any) {
    this.unitId?.patchValue('');
    this.getUnitByGroupId(groupId);
  }
  getUnitByGroupId(groupId: any) {
    if(groupId)
    {
      this.unitService.getUnitByGroup(groupId).subscribe((res) => {
        this.unitDropdown = res.apiData;
        this.allUnitDropdown = res.apiData;
      });
    }
    else
    {
      this.unitDropdown = [];
      this.allUnitDropdown = [];
      this.unitId?.patchValue('');
    }
  }
  onSearchUnit(value: any) {
    this.unitDropdown = this.findUnit(value);
  }
  findUnit(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allUnitDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allUnitDropdown;
    }
  }
  getAllGroupDropdown() {
    this.groupService.getAllGroupDropdown().subscribe((res) => {
      this.groupDropdown = res.apiData;
      this.allGroupDropdown = res.apiData;
    });
  }
  onSearchGroup(value: any) {
    this.groupDropdown = this.findGroup(value);
  }
  findGroup(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allGroupDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allGroupDropdown;
    }
  }
  get nameBangla() {
    return this.form.get("nameBangla");
  }
  get nameEnglish() {
    return this.form.get("nameEnglish");
  }
  get groupId() {
    return this.form.get("groupId");
  }
  get unitId() {
    return this.form.get("unitId");
  }
  onSubmit() {
    const obj :any = {
      nameBangla: this.form.value.nameBangla,
      nameEnglish: this.form.value.nameEnglish,
      groupId: this.form.value.groupId,
      unitId: this.form.value.unitId
    }
    if(this.data){
      obj.departmentId = this.data.departmentId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.departmentService.addDepartment(obj).
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
            this.commonService.showErrorMsg(JSON.stringify(error));
          }
        );
    }
    if (this.form.valid && this.data) {
      this.asyncService.start();
      this.departmentService.updateDepartment(obj).subscribe(
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
