import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserService } from '../../services/user.service';
import { Password } from '../../models/password';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  //form: FormGroup;
  formId = "ChangePassword"
  spanP: any;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public userService: UserService,
    public dialogRef: MatDialogRef<any>) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required], [this.matchCurrentPassword]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(14), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[0-9A-Za-z\d$@$!%*?&].{7,}')]],
      confirmPassword: ['', [Validators.required]]
    }
      , { validator: this.ConfirmedValidator('newPassword', 'confirmPassword') }
    )
  }
  get userId() {
    return localStorage.getItem("userId");
  }
  get currentPassword() {
    return this.form.get("currentPassword");
  }
  get newPassword() {
    return this.form.get("newPassword");
  }
  get confirmPassword() {
    return this.form.get("confirmPassword");
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  matchCurrentPassword = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    let userId = localStorage.getItem('userId');
    return this.userService.matchCurrentPassword(userId, control.value).pipe(
      map((x: any) => {
        return x.apiData ? null : { matches: false };
      })
    );
  };
  onSubmit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.userService.changePassword(this.userId, this.form.value.newPassword).subscribe(res => {
          this.asyncService.finish();
          if (res) {
            if (res.isExecute === true) {
              this.commonService.showSuccessMsg(res.message);
            }
            else {
              this.commonService.showErrorMsg(res.message);
            }
          } else {
            this.asyncService.finish();
            this.commonService.showErrorMsg(
              'System error !'
            );
          }
        }, error => {
          this.asyncService.finish();
          this.commonService.showErrorMsg(JSON.stringify(error));
        })
      }})
  }
}
