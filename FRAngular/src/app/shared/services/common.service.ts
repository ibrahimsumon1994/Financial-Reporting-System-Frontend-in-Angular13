import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, of } from "rxjs";

import { UIInfo } from "../models/ui-info.model";
import { ConfirmationDialog } from "../models/confirmation-dialog.model";
import { ConfirmDialogComponent } from "../components/confirmation-dialog.component";

@Injectable()
export class CommonService {
  featureCode: any
  moduleCode: any
  appId: any
  authLevel: any
  private _defaultData: UIInfo = {
    title: "",
    formId: "",
    goBackPath: "/",
    refreshPath: "/"
  };

  private _dataSource$ = new BehaviorSubject<UIInfo>(this._defaultData);
  private _serviceModalData$ = new BehaviorSubject<any>({});

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  get uiInfo(): Observable<UIInfo> {
    return this._dataSource$.asObservable();
  }

  get serviceModalData(): Observable<any> {
    return this._dataSource$.asObservable();
  }

  setUiInfo(info: UIInfo): void {
    this._dataSource$.next(info);
  }

  setServiceModalData(obj: any): void {
    this._serviceModalData$.next(obj);
  }
  showSuccessMsg(msg: string, duration = 2500): void {
    this.snackBar.open(msg, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["snackbar-container", "success"]
    });
  }
  showSuccessMsgForAdd(msg: string, duration = 2500): void {
    this.snackBar.open(msg, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["mat-toolbar", "mat-primary"]
    });
  }
  showSuccessMsgForUpdate(msg: string, duration = 2500): void {
    this.snackBar.open(msg, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["mat-toolbar", "mat-accent"]
    });
  }
  showSuccessMsgForDelete(msg: string, duration = 2500): void {
    this.snackBar.open(msg, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["mat-toolbar", "mat-warn"]
    });
  }
  showErrorMsg(msg: string, duration = 2500): void {
    this.snackBar.open(msg, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["snackbar-container", "danger"]
    });
  }

  showDialog(data: ConfirmationDialog, callback: Function): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "550px",
      data
    });
    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        if (callback) {
          callback();
        }
      }
    });
  }
  removeEmptyProperties = (obj: any) => {
    for (const prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
        delete obj[prop];
      }
    }
  };
}
