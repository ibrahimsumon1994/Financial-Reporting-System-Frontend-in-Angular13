import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { GroupService } from '../../services/group.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-unit-add',
  templateUrl: './unit-add.component.html',
  styleUrls: ['./unit-add.component.scss']
})
export class UnitAddComponent implements OnInit {
  form!: FormGroup;
  groupDropdown: any;
  allGroupDropdown: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public unitService: UnitService,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() : void {
    this.form = this.fb.group({
      nameBangla: ['', Validators.compose([Validators.required])],
      nameEnglish: ['', Validators.compose([Validators.required])],
      groupId: ['', Validators.compose([Validators.required])]
    })
    if (this.data) {
      this.nameBangla?.patchValue(this.data.nameBangla)
      this.nameEnglish?.patchValue(this.data.nameEnglish)
      this.groupId?.patchValue(this.data.groupId)
    }
    this.getAllGroupDropdown();
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
  onSubmit() {
    const obj :any = {
      nameBangla: this.form.value.nameBangla,
      nameEnglish: this.form.value.nameEnglish,
      groupId: this.form.value.groupId,
    }
    if(this.data){
      obj.unitId = this.data.unitId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.unitService.addUnit(obj).
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
      this.unitService.updateUnit(obj).
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
