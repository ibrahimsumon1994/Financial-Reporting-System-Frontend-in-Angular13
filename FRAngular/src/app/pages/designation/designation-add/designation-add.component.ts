import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DepartmentService } from '../../services/department.service';
import { DesignationService } from '../../services/designation.service';

@Component({
  selector: 'app-designation-add',
  templateUrl: './designation-add.component.html',
  styleUrls: ['./designation-add.component.scss']
})
export class DesignationAddComponent implements OnInit {
  form!: FormGroup;
  departmentDropdown: any;
  allDepartmentDropdown: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public designationService: DesignationService,
    public departmentService: DepartmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() : void {
    this.form = this.fb.group({
      nameBangla: ['', Validators.compose([Validators.required])],
      nameEnglish: ['', Validators.compose([Validators.required])],
      departmentId: ['']
    })
    if (this.data) {
      this.nameBangla?.patchValue(this.data.nameBangla)
      this.nameEnglish?.patchValue(this.data.nameEnglish)
      this.departmentId?.patchValue(this.data.departmentId)
    }
    this.getAllDepartmentDropdown();
  }
  getAllDepartmentDropdown() {
    this.departmentService.getAllDepartmentDropdown().subscribe((res) => {
      this.departmentDropdown = res.apiData;
      this.allDepartmentDropdown = res.apiData;
    });
  }
  onSearchDepartment(value: any) {
    this.departmentDropdown = this.findDepartment(value);
  }
  findDepartment(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allDepartmentDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allDepartmentDropdown;
    }
  }
  get nameBangla() {
    return this.form.get("nameBangla");
  }
  get nameEnglish() {
    return this.form.get("nameEnglish");
  }
  get departmentId() {
    return this.form.get("departmentId");
  }
  onSubmit() {
    const obj :any = {
      nameBangla: this.form.value.nameBangla,
      nameEnglish: this.form.value.nameEnglish,
      departmentId: this.form.value.departmentId,
    }
    if(this.data){
      obj.designationId = this.data.designationId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.designationService.addDesignation(obj).
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
      this.designationService.updateDesignation(obj).
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
  }
}
