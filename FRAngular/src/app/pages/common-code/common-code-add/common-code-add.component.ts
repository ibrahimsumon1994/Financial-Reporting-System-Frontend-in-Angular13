import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DepartmentService } from '../../services/department.service';
import { CommonCodeService } from '../../services/common-code.service';

@Component({
  selector: 'app-common-code-add',
  templateUrl: './common-code-add.component.html',
  styleUrls: ['./common-code-add.component.scss']
})
export class CommonCodeAddComponent implements OnInit {
  form!: FormGroup;
  departmentDropdown: any;
  allDepartmentDropdown: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public commonCodeService: CommonCodeService,
    public departmentService: DepartmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() : void {
    this.form = this.fb.group({
      nameBangla: ['', Validators.compose([Validators.required])],
      nameEnglish: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      code: [''],
      departmentId: ['']
    })
    if (this.data) {
      this.nameBangla?.patchValue(this.data.nameBangla)
      this.nameEnglish?.patchValue(this.data.nameEnglish)
      this.type?.patchValue(this.data.type)
      this.code?.patchValue(this.data.code)
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
  get type() {
    return this.form.get("type");
  }
  get code() {
    return this.form.get("code");
  }
  get departmentId() {
    return this.form.get("departmentId");
  }
  onSubmit() {
    const obj :any = {
      nameBangla: this.form.value.nameBangla,
      nameEnglish: this.form.value.nameEnglish,
      type: this.form.value.type,
      code: this.form.value.code,
      departmentId: this.form.value.departmentId,
    }
    if(this.data){
      obj.commonCodeId = this.data.commonCodeId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.commonCodeService.addCommonCode(obj).subscribe(
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
      this.commonCodeService.updateCommonCode(obj).subscribe(
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
