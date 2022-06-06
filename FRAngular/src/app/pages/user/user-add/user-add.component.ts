import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserService } from '../../services/user.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DepartmentService } from '../../services/department.service';
import { DesignationService } from '../../services/designation.service';
import { GroupService } from '../../services/group.service';
import { UnitService } from '../../services/unit.service';
import * as moment from 'moment';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  // photourllink: string = "assets/images/user-photo1.png";
  // selectFile(event:any) {
  //   if (event.target.files) {
  //     var reader = new FileReader()
  //     reader.readAsDataURL(event.target.files[0])
  //     reader.onload = (event: any) => {
  //       this.photourllink = event.target.result
  //     }
  //   }
  // }
  url: any;
  imgArrayy: any;
  signArrayy: any;
  form!: FormGroup;
  designationDropdown: any;
  allDesignationDropdown: any;
  groupDropdown: any;
  allGroupDropdown: any;
  unitDropdown: any;
  allUnitDropdown: any;
  departmentDropdown: any;
  allDepartmentDropdown: any;
  ipAddress:any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public userService: UserService,
    public departmentService: DepartmentService,
    public designationService: DesignationService,
    public groupService: GroupService,
    public unitService: UnitService,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', [Validators.required], this.data ? [] :  [this.validate]],
      password: this.data?['']:['', [Validators.required, Validators.minLength(8), Validators.maxLength(14), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[0-9A-Za-z\d$@$!%*?&].{7,}')]],
      userFullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required]],
      employeeId:['',[Validators.required]],
      dob: [''],
      presentAddress: [''],
      permanentAddress: [''],
      designationId: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      unitId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      picture: [''],
      signature: ['']
    })
    if (this.data) {
      this.userId?.patchValue(this.data.userId)
      this.userFullName?.patchValue(this.data.fullName)
      this.password?.patchValue(this.data.password)
      this.dob?.patchValue(this.data.dateOfBirth)
      this.presentAddress?.patchValue(this.data.presentAddress)
      this.permanentAddress?.patchValue(this.data.permanentAddress)
      this.designationId!.patchValue(this.data.designationId)
      this.mobileNo?.patchValue(this.data.mobileNo)
      this.employeeId?.patchValue(this.data.employeeId)
      this.email?.patchValue(this.data.email)
      this.picture?.patchValue(this.data.picture)
      this.signature?.patchValue(this.data.signature)
      this.groupId?.patchValue(this.data.groupId)
      this.getUnitByGroupId(this.data.groupId)
      this.getDepartmentByUnitId(this.data.unitId)
      this.unitId?.patchValue(this.data.unitId)
      this.departmentId?.patchValue(this.data.departmentId)
      this.imgArrayy = this.data.picture;
      this.signArrayy = this.data.signature;
    }
    this.getAllDesignation();
    this.getAllGroup();
  }
  clickOnGetDepartmentByUnitId(unitId: any) {
    this.departmentId?.patchValue('');
    this.getDepartmentByUnitId(unitId);
  }
  getDepartmentByUnitId(unitId: any) {
    if(unitId)
    {
      this.departmentService.getDepartmentByUnit(unitId).subscribe((res) => {
        this.departmentDropdown = res.apiData;
        this.allDepartmentDropdown = res.apiData;
      });
    }
    else
    {
      this.departmentDropdown = [];
      this.allDepartmentDropdown = [];
      this.departmentId?.patchValue('');
    }
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
  clickOnGetUnitByGroupId(groupId: any) {
    this.unitId?.patchValue('');
    this.departmentId?.patchValue('');
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
      this.departmentDropdown = [];
      this.allDepartmentDropdown = [];
      this.unitId?.patchValue('');
      this.departmentId?.patchValue('');
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
  getAllGroup = (): void => {
    this.groupService.getAllGroupDropdown().subscribe((res) => {
      this.groupDropdown = res.apiData;
      this.allGroupDropdown = res.apiData;
    })
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
  getAllDesignation = (): void => {
    this.designationService.getAllDesignation().subscribe((res) => {
      this.designationDropdown = res.apiData;
      this.allDesignationDropdown = res.apiData;
    })
  }
  onSearchDesignation(value: any) {
    this.designationDropdown = this.findDesignation(value);
  }
  findDesignation(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allDesignationDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allDesignationDropdown;
    }
  }
  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.userService.getUserIdToCheckDuplicate(control.value)
      .pipe
      (map((x: any) => { return x.isExecute ? { exists: true } : null; }))
    //)
  }
  get userId() {
    return this.form.get("userId");
  }
  get password() {
    return this.form.get("password");
  }
  get userFullName() {
    return this.form.get("userFullName");
  }
  get email() {
    return this.form.get("email");
  }
  get mobileNo() {
    return this.form.get("mobileNo");
  }
  get employeeId() {
    return this.form.get("employeeId");
  }
  get presentAddress() {
    return this.form.get("presentAddress");
  }
  get permanentAddress() {
    return this.form.get("permanentAddress");
  }
  get dob() {
    return this.form.get("dob");
  }
  get designationId() {
    return this.form.get("designationId");
  }
  get picture() {
    return this.form.get("picture");
  }
  get signature() {
    return this.form.get("signature");
  }
  get groupId() {
    return this.form.get("groupId");
  }
  get unitId() {
    return this.form.get("unitId");
  }
  get departmentId() {
    return this.form.get("departmentId");
  }
  uploadPic(files: any) {
    const file = files.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.url = null;
      this.url = reader.result;
      var base64Index = this.url.indexOf(';base64,') + ';base64,'.length;
      var base64 = this.url.substring(base64Index);
      // var raw = window.atob(base64);
      // var rawLength = raw.length;
      // let imgArray = new Uint8Array(new ArrayBuffer(rawLength));
      // for (let i = 0; i < rawLength; i++) {
      //   imgArray[i] = raw.charCodeAt(i);
      // }
      this.imgArrayy = base64;
    }
  }
  uploadSign(files: any) {
    const file = files.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.url = null;
      this.url = reader.result;
      var base64Index = this.url.indexOf(';base64,') + ';base64,'.length;
      var base64 = this.url.substring(base64Index);
      // var raw = window.atob(base64);
      // var rawLength = raw.length;
      // let imgArray = new Uint8Array(new ArrayBuffer(rawLength));
      // for (let i = 0; i < rawLength; i++) {
      //   imgArray[i] = raw.charCodeAt(i);
      // }
      this.signArrayy = base64;
    }
  }
  onSubmit() {
    const obj: any = {
      userId: this.form.value.userId,
      password: this.form.value.password,
      fullName: this.form.value.userFullName,
      designationId: this.form.value.designationId,
      mobileNo: this.form.value.mobileNo,
      employeeId:this.form.value.employeeId,
      email: this.form.value.email,
      dateOfBirth: moment(this.form.value.dob).format('YYYY-MM-DD'),
      permanentAddress: this.form.value.permanentAddress,
      presentAddress: this.form.value.presentAddress,
      picture: this.form.value.picture ? this.imgArrayy ? this.imgArrayy : this.data.picture : null,
      signature: this.form.value.signature ? this.signArrayy ? this.signArrayy : this.data.signature : null,
      groupId: this.form.value.groupId,
      unitId: this.form.value.unitId,
      departmentId: this.form.value.departmentId,
      ipAddress: this.ipAddress,

    }
    if (this.data) {
      obj.userId = this.data.userId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.userService.addUser(obj).
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
      this.userService.updateUser(obj).
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

  deletePicture() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.form.value.picture = null;
        this.imgArrayy = null;
        this.picture?.patchValue(null)
        this.form.controls['picture'].setValue(null, { emitEvent: false });
        const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="picture"] input[type="file"]');
        fileInput.value = '';
      }
    })
  }

  deleteSignature() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.form.value.signature = null;
        this.signArrayy = null;
        this.signature?.patchValue(null)
        this.form.controls['signature'].setValue(null, { emitEvent: false });
        const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="signature"] input[type="file"]');
        fileInput.value = '';
      }
    })
  }
}
