import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CommonCodeService } from '../../services/common-code.service';
import { HeaderService } from '../../services/header.service';
import { TransactionService } from '../../services/transaction.service';
import { UserWiseUnitPermissionService } from '../../services/user-wise-unit-permission.service';
import * as XLSX from 'xlsx';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-transaction-add',
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TransactionAddComponent implements OnInit {
  form!: FormGroup;
  transactionTypeDropdown: any;
  versionTypeDropdown: any;
  allVersionTypeDropdown: any;
  unitDropdown: any;
  allUnitDropdown: any;
  headerTypeDropdown: any;
  firstHeaderDropdown: any;
  allFirstHeaderDropdown: any;
  secondHeaderDropdown: any;
  allSecondHeaderDropdown: any;
  transactionList: any;
  date = new FormControl(moment());
  arrayBuffer: any;
  isExcelUploadOrManualInput: any;
  itemList: any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private commonService: CommonService,
    public commonCodeService: CommonCodeService,
    public userWiseUnitPermissionService: UserWiseUnitPermissionService,
    public headerService: HeaderService,
    public transactionService: TransactionService
  ) {}
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.form = this.fb.group({
      transactionTypeId: [''],
      versionId: [''],
      unitId: [''],
      headerTypeId: [''],
      firstHeaderId: [''],
      secondHeaderId: [''],
      inputType: [''],
      dataSheet: ['']
    });
    this.getTransactionTypeDropdown();
    this.getVersionTypeDropdown();
    this.getHeaderTypeDropdown();
    this.getUnitDropdown(userId);
    this.form.controls['versionId'].disable();
    this.form.controls['unitId'].disable();
    this.form.controls['headerTypeId'].disable();
    this.form.controls['inputType'].disable();
    this.form.controls['firstHeaderId'].disable();
    this.form.controls['secondHeaderId'].disable();
  }

  export(): void {
    const transaction: any = {
      transactionDate: moment(this.date.value).format('YYYY-MM-DD'),
      transactionTypeId: this.form.value.transactionTypeId,
      versionId: this.form.value.versionId,
      unitId: this.form.value.unitId,
      headerTypeId: this.form.value.headerTypeId
    };
    this.transactionService
        .getAllHeaderItemsWithDataByHeaderType(transaction)
        .subscribe((res) => {
          /* generate worksheet */
          if(res)
          {
            if(res.apiData)
            {
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.apiData);

              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              /* save to file */
              XLSX.writeFile(wb, 'Sample.xlsx');
            }
            else
            {
              this.commonService.showErrorMsg(res.message);
            }
          }
        });
  }

  uploadFileEvt(event: any) {
    const file= event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      this.itemList = arraylist;
    }
  }

  get transactionTypeId() {
    return this.form.get('transactionTypeId');
  }
  get versionId() {
    return this.form.get('versionId');
  }
  get unitId() {
    return this.form.get('unitId');
  }
  get headerTypeId() {
    return this.form.get('headerTypeId');
  }
  get inputType() {
    return this.form.get('inputType');
  }
  get firstHeaderId() {
    return this.form.get('firstHeaderId');
  }
  get secondHeaderId() {
    return this.form.get('secondHeaderId');
  }

  enableVersion(transactionTypeId: any) {
    if (transactionTypeId) {
      const transactionTypeData = this.transactionTypeDropdown.find(
        (option: any) => option.commonCodeId == transactionTypeId
      );
      if (
        transactionTypeData &&
        transactionTypeData.nameEnglish === 'Forecast'
      ) {
        this.form.controls['versionId'].enable();
        this.form.controls['unitId'].disable();
        this.form.controls['headerTypeId'].disable();
        this.form.controls['inputType'].disable();
        this.form.controls['firstHeaderId'].disable();
        this.form.controls['secondHeaderId'].disable();
        this.unitId?.patchValue(null);
        this.headerTypeId?.patchValue(null);
        this.inputType?.patchValue(null);
        this.firstHeaderId?.patchValue(null);
        this.secondHeaderId?.patchValue(null);
        this.firstHeaderDropdown = null;
        this.allFirstHeaderDropdown = null;
        this.secondHeaderDropdown = null;
        this.allSecondHeaderDropdown = null;
      } else {
        this.form.controls['versionId'].disable();
        this.versionId?.patchValue(null);
        this.form.controls['unitId'].enable();
      }
    } else {
      this.form.controls['versionId'].disable();
      this.form.controls['unitId'].disable();
      this.form.controls['headerTypeId'].disable();
      this.form.controls['inputType'].disable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.versionId?.patchValue(null);
      this.unitId?.patchValue(null);
      this.headerTypeId?.patchValue(null);
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.firstHeaderDropdown = null;
      this.allFirstHeaderDropdown = null;
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
    }
  }

  enableUnit(versionId: any) {
    if (versionId) {
      this.form.controls['unitId'].enable();
    } else {
      this.form.controls['unitId'].disable();
      this.form.controls['headerTypeId'].disable();
      this.form.controls['inputType'].disable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.unitId?.patchValue(null);
      this.headerTypeId?.patchValue(null);
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.firstHeaderDropdown = null;
      this.allFirstHeaderDropdown = null;
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
    }
  }

  enableEntryType(unitId: any) {
    if (unitId) {
      this.form.controls['headerTypeId'].enable();
      this.form.controls['inputType'].disable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.headerTypeId?.patchValue(null);
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.firstHeaderDropdown = null;
      this.allFirstHeaderDropdown = null;
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
    } else {
      this.form.controls['headerTypeId'].disable();
      this.form.controls['inputType'].disable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.headerTypeId?.patchValue(null);
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.firstHeaderDropdown = null;
      this.allFirstHeaderDropdown = null;
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
    }
  }

  getFirstHeaderByHeaderType(headerTypeId: any) {
    if (headerTypeId) {
      this.form.controls['inputType'].enable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
      this.headerService
        .getFirstHeaderByHeaderType(headerTypeId)
        .subscribe((res) => {
          this.firstHeaderDropdown = res.apiData;
          this.allFirstHeaderDropdown = res.apiData;
        });
    } else {
      this.form.controls['inputType'].disable();
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.inputType?.patchValue(null);
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.firstHeaderDropdown = null;
      this.allFirstHeaderDropdown = null;
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
    }
  }

  excelUploadOrManualInput(inputType: any) {
    this.isExcelUploadOrManualInput = inputType;
    if(inputType === 'Y')
    {
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
      this.itemList = null;
    }
    else if(inputType === 'N')
    {
      this.form.controls['firstHeaderId'].enable();
      this.form.controls['secondHeaderId'].disable();
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
      this.itemList = null;
    }
    else
    {
      this.form.controls['firstHeaderId'].disable();
      this.form.controls['secondHeaderId'].disable();
      this.firstHeaderId?.patchValue(null);
      this.secondHeaderId?.patchValue(null);
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
      this.itemList = null;
    }
  }

  getSecondHeaderByFirstHeader(firstHeaderId: any) {
    if (firstHeaderId) {
      this.form.controls['secondHeaderId'].enable();
      this.secondHeaderId?.patchValue(null);
      this.transactionList = null;
      this.headerService
        .getSecondHeaderByFirstHeader(firstHeaderId)
        .subscribe((res) => {
          this.secondHeaderDropdown = res.apiData;
          this.allSecondHeaderDropdown = res.apiData;
        });
    } else {
      this.form.controls['secondHeaderId'].disable();
      this.secondHeaderId?.patchValue(null);
      this.secondHeaderDropdown = null;
      this.allSecondHeaderDropdown = null;
      this.transactionList = null;
    }
  }

  getItemsWithDataBySecondHeader(secondHeaderId: any) {
    if (secondHeaderId) {
      const transaction: any = {
        transactionDate: moment(this.date.value).format('YYYY-MM-DD'),
        transactionTypeId: this.form.value.transactionTypeId,
        versionId: this.form.value.versionId,
        unitId: this.form.value.unitId,
        headerTypeId: this.form.value.headerTypeId,
        firstHeaderId: this.form.value.firstHeaderId,
        secondHeaderId: secondHeaderId,
      };
      this.transactionService
        .getItemsWithDataBySecondHeader(transaction)
        .subscribe((res) => {
          this.transactionList = res.apiData;
        });
    } else {
      this.transactionList = null;
    }
  }

  onFocusOutValueEvent(event: any, item: any) {
    let index = this.transactionList.findIndex(
      (option: any) => option.thirdHeaderId == item.thirdHeaderId
    );
    this.transactionList[index].value = event.target.value;
  }

  // onFocusOutRemarksEvent(event: any, item:any) {
  //   let index = this.transactionList.findIndex((option:any) => option.thirdHeaderId == item.thirdHeaderId);
  //   this.transactionList[index].remarks = event.target.value;
  // }

  onFocusOutValueEventForExcel(event: any, item: any) {
    let index = this.itemList.findIndex(
      (option: any) => option.itemName == item.itemName && option.subHeader == item.subHeader && option.header == item.header
    );
    this.itemList[index].value = event.target.value;
  }

  keytab(id: any) {
    if (id == null) {
      return;
    } else {
      this.checkHtmlElementAndFocus(id);
    }
  }

  checkHtmlElementAndFocus(id: any) {
    let checkId = <HTMLInputElement>document.getElementById(id + 1);
    if (checkId) {
      if (checkId.disabled) {
        this.checkHtmlElementAndFocus(id + 1);
      } else {
        checkId.focus();
      }
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.form.controls['versionId'].disable();
    this.form.controls['unitId'].disable();
    this.form.controls['headerTypeId'].disable();
    this.form.controls['inputType'].disable();
    this.form.controls['firstHeaderId'].disable();
    this.form.controls['secondHeaderId'].disable();
    this.transactionTypeId?.patchValue(null);
    this.versionId?.patchValue(null);
    this.unitId?.patchValue(null);
    this.headerTypeId?.patchValue(null);
    this.inputType?.patchValue(null);
    this.firstHeaderId?.patchValue(null);
    this.secondHeaderId?.patchValue(null);
    this.firstHeaderDropdown = null;
    this.allFirstHeaderDropdown = null;
    this.secondHeaderDropdown = null;
    this.allSecondHeaderDropdown = null;
  }

  getTransactionTypeDropdown = (): void => {
    this.commonCodeService
      .getCommonCodeForDropdown('TransactionType')
      .subscribe((res) => {
        this.transactionTypeDropdown = res.apiData;
      });
  };

  getVersionTypeDropdown = (): void => {
    this.commonCodeService
      .getCommonCodeForDropdown('VersionType')
      .subscribe((res) => {
        this.versionTypeDropdown = res.apiData;
        this.allVersionTypeDropdown = res.apiData;
      });
  };

  getHeaderTypeDropdown = (): void => {
    this.commonCodeService
      .getCommonCodeForDropdown('HeaderType')
      .subscribe((res) => {
        this.headerTypeDropdown = res.apiData;
      });
  };

  getUnitDropdown = (userId: any): void => {
    this.userWiseUnitPermissionService
      .getUserWiseUnitForDropdown(userId)
      .subscribe((res) => {
        this.unitDropdown = res.apiData;
        this.allUnitDropdown = res.apiData;
      });
  };

  onSearchVersionType(value: any) {
    this.versionTypeDropdown = this.findVersionType(value);
  }

  findVersionType(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allVersionTypeDropdown.filter((option: any) =>
        option.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allVersionTypeDropdown;
    }
  }

  onSearchUnit(value: any) {
    this.unitDropdown = this.findUnit(value);
  }

  findUnit(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allUnitDropdown.filter((option: any) =>
        option.unit.nameEnglish.toLowerCase().includes(filter)
      );
    } else {
      return this.allUnitDropdown;
    }
  }

  onSearchFirstHeader(value: any) {
    this.firstHeaderDropdown = this.findFirstHeader(value);
  }

  findFirstHeader(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allFirstHeaderDropdown.filter((option: any) =>
        option.headerName.toLowerCase().includes(filter)
      );
    } else {
      return this.allFirstHeaderDropdown;
    }
  }

  onSearchSecondHeader(value: any) {
    this.secondHeaderDropdown = this.findSecondHeader(value);
  }

  findSecondHeader(value: string) {
    const filter = value.toLowerCase();
    if (value !== '') {
      return this.allSecondHeaderDropdown.filter((option: any) =>
        option.headerName.toLowerCase().includes(filter)
      );
    } else {
      return this.allSecondHeaderDropdown;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.asyncService.start();
      this.transactionList.forEach((option: any) => {
        option.versionId = this.form.value.versionId;
      });
      this.transactionService
        .addOrUpdateTransaction(this.transactionList)
        .subscribe(
          (data) => {
            if (data) {
              if (data.isExecute) {
                this.form.reset();
                this.firstHeaderDropdown = null;
                this.allFirstHeaderDropdown = null;
                this.secondHeaderDropdown = null;
                this.allSecondHeaderDropdown = null;
                this.asyncService.finish();
                this.commonService.showSuccessMsg(data.message);
              } else {
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

  onSubmitExcelData() {
    if (this.form.valid) {
      this.asyncService.start();
      this.transactionService
        .addOrUpdateTransactionFromExcel(this.itemList)
        .subscribe(
          (data) => {
            if (data) {
              if (data.isExecute) {
                this.form.reset();
                this.asyncService.finish();
                this.commonService.showSuccessMsg(data.message);
              } else {
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
