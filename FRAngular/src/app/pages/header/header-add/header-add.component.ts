import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconList } from 'src/app/shared/models/icon-list';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from '../../services/header.service';
import { CommonCodeService } from '../../services/common-code.service';

@Component({
  selector: 'app-header-add',
  templateUrl: './header-add.component.html',
  styleUrls: ['./header-add.component.scss']
})
export class HeaderAddComponent implements OnInit {
  form!: FormGroup;
  allHeaderTypeDropdown: any;
  headerTypeDropdown: any;
  allParentHeaderDropdown: any;
  parentHeaderDropdown: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public headerService: HeaderService,
    public dialogRef: MatDialogRef<any>,
    public commonCodeService: CommonCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      headerCode: ['', Validators.compose([Validators.required])],
      headerName: ['', Validators.compose([Validators.required])],
      headerLayer: ['', Validators.compose([Validators.required])],
      headerTypeId: ['', Validators.compose([Validators.required])],
      parentHeaderId: [0, Validators.compose([Validators.required])],
      remarks: ['']
    })
    if (this.data) {
      this.headerName?.patchValue(this.data.headerName);
      this.headerLayer?.patchValue(this.data.headerLayer);
      this.headerTypeId?.patchValue(this.data.headerTypeId);
      this.parentHeaderId?.patchValue(this.data.parentHeaderId);
      this.remarks?.patchValue(this.data.remarks);
      this.headerCode?.patchValue(this.data.headerCode);
      if(this.data.headerLayer === 1)
      {
        this.form.controls['parentHeaderId'].disable();
      }
      else
      {
        this.form.controls['parentHeaderId'].enable();
        this.getParentHeaderDropdown(this.data.headerTypeId, this.data.headerLayer);
      }
    }
    else
    {
      this.disableHeaderLayerOnClick(null);
      this.hideParentHeaderOnClick(null);
    }
    this.getHeaderTypeDropdown();
  }

  hideParentHeaderOnClick(headerLayer: any) {
    this.parentHeaderId?.patchValue(null);
    if(headerLayer)
    {
      if(headerLayer === 1)
      {
        this.form.controls['parentHeaderId'].disable();
        this.getHeaderCode(null);
      }
      else
      {
        this.getParentHeaderDropdown(this.form.value.headerTypeId, headerLayer)
        this.form.controls['parentHeaderId'].enable();
        this.headerCode?.patchValue(null);
      }
    }
    else
    {
      this.form.controls['parentHeaderId'].disable();
      this.headerCode?.patchValue(null);
    }
  }

  disableHeaderLayerOnClick(headerTypeId: any) {
    this.headerLayer?.patchValue(null);
    this.parentHeaderId?.patchValue(null);
    this.headerCode?.patchValue(null);
    this.form.controls['parentHeaderId'].disable();
    if(headerTypeId)
    {
      this.form.controls['headerLayer'].enable();
    }
    else
    {
      this.form.controls['headerLayer'].disable();
    }
  }

  getHeaderCode(parentHeaderId: any) {
    const header: any = {
      headerLayer: this.form.value.headerLayer,
      headerTypeId: this.form.value.headerTypeId,
      parentHeaderId: parentHeaderId
    }
    this.headerService.getHeaderCode(header).subscribe((res) => {
      if(res.apiData)
      {
        this.headerCode?.patchValue(res.apiData);
        this.form.value.headerCode = res.apiData;
      }
      else
      {
        this.headerCode?.patchValue(null);
      }
    });
  }

  getParentHeaderDropdown(headerTypeId: any, headerLayer: any) {
    if(headerLayer != 1)
    {
      const header: any = {
        headerTypeId: headerTypeId,
        headerLayer: headerLayer
      }
      this.headerService.getParentHeaderByTypeAndLayerForDropdown(header).subscribe((res) => {
        if(this.data)
        {
          if(res.apiData)
          {
            this.parentHeaderDropdown = res.apiData.filter((option:any) =>
              option.headerId !== this.data.headerId
            );
            this.allParentHeaderDropdown = this.parentHeaderDropdown;
          }
        }
        else
        {
          this.parentHeaderDropdown = res.apiData;
          this.allParentHeaderDropdown = res.apiData;
        }
      });
    }
  }

  getHeaderTypeDropdown = (): void => {
    this.commonCodeService.getCommonCodeForDropdown("HeaderType").subscribe((res) => {
      this.headerTypeDropdown = res.apiData;
      this.allHeaderTypeDropdown = res.apiData;
    });
  }

  onSearchParentHeader(value: any) {
    this.parentHeaderDropdown = this.findParentHeader(value);
  }

  findParentHeader(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allParentHeaderDropdown.filter((option:any) =>
        option.headerName.toLowerCase().includes(filter)
      );
    } else {
      return this.allParentHeaderDropdown;
    }
  }

  onSearchHeaderType(value: any) {
    this.headerTypeDropdown = this.findHeaderType(value);
  }

  findHeaderType(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allHeaderTypeDropdown.filter((option:any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allHeaderTypeDropdown;
    }
  }

  get headerCode() {
    return this.form.get("headerCode");
  }
  get headerName() {
    return this.form.get("headerName");
  }
  get headerLayer() {
    return this.form.get("headerLayer");
  }
  get headerTypeId() {
    return this.form.get("headerTypeId");
  }
  get parentHeaderId() {
    return this.form.get("parentHeaderId");
  }
  get remarks() {
    return this.form.get("remarks");
  }

  onSubmit() {
    console.log(this.form.value.headerCode);

    const obj: any = {
      headerCode: this.form.value.headerCode,
      headerName: this.form.value.headerName,
      headerLayer: this.form.value.headerLayer,
      headerTypeId: this.form.value.headerTypeId,
      parentHeaderId: this.form.value.parentHeaderId,
      remarks: this.form.value.remarks
    }
    if (this.data) {
      obj.headerId = this.data.headerId
    }
    if (!this.data && this.form.valid) {
      this.asyncService.start();
      this.headerService.addHeader(obj).
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
            this.commonService.showSuccessMsgForDelete(JSON.stringify(error));
          }
        );
    }
    if (this.form.valid && this.data) {
      this.asyncService.start();
      this.headerService.updateHeader(obj).subscribe(
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
