import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DepartmentService } from '../../services/department.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public groupService: GroupService,
    public departmentService: DepartmentService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() : void {
    this.form = this.fb.group({
      nameBangla: ['', Validators.compose([Validators.required])],
      nameEnglish: ['', Validators.compose([Validators.required])]
    })
    if (this.data) {
      this.nameBangla?.patchValue(this.data.nameBangla)
      this.nameEnglish?.patchValue(this.data.nameEnglish)
    }
  }
  get nameBangla() {
    return this.form.get("nameBangla");
  }
  get nameEnglish() {
    return this.form.get("nameEnglish");
  }
  onSubmit() {
    const obj :any = {
      nameBangla: this.form.value.nameBangla,
      nameEnglish: this.form.value.nameEnglish
    }
    if(this.data){
      obj.groupId = this.data.groupId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.groupService.addGroup(obj).
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
      this.groupService.updateGroup(obj).
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
