import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../../services/user.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { merge } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  length: any;
  deleteUser!: Subscription;
  categoryDropdown: any;
  getAll!: Subscription;
  Des1!: Subscription;
  Des2!: Subscription;
  displayedColumns: string[] = [
    'sl',
    'name',
    'userId',
    'employeeId',
    'designation',
    'group',
    'unit',
    'department',
    'email',
    'mobileNo',
    'recStatus',
    'picture',
    'signature',
    'actions'];
  searchString: string = '';
  dataSource = new MatTableDataSource<any>();
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public commonService: CommonService,
    public asyncService: AsyncService,
    private _sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService) { }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.searchString = filterValue;
    this.loadAllUsers();
  }

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  ngOnInit() {
    // this.loadAllUsers;
    // this.dataSource.paginator = this.paginator;
    // this.userService.getAllDesignation().subscribe((res) => {
    //   this.categoryDropdown = res.apiData;
    // })
  }
  ngAfterViewInit() {
    this.loadAllUsers();
    //this.dataSource.paginator = this.paginator;
  }
  loadAllUsers = (): void => {
    if(this.searchString)
    {
      this.paginator.pageIndex = 0;
    }
    this.paginator.page.subscribe((resp) => { });
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.spinnerService.show();
          this.asyncService.start();
          return this.userService.getAllUser(
            {
              "page": this.paginator.pageIndex + 1,
              "pageSize": this.paginator.pageSize,
              "searchString": this.searchString
            }
          )
        }),
        map(data => {
          this.dataSource.paginator = this.paginator;
          this.length = data.totalRecord;
          this.dataSource.paginator = data.apidata;
          this.asyncService.finish();
          if(data.isExecute === false)
            this.commonService.showSuccessMsgForAdd(data.message);
          //this.spinnerService.hide();
          return data;
        })
      )
      .subscribe(
        data => {
          this.length = data.totalRecord;
          this.dataSource.data = data.apiData;
          this.asyncService.finish();
          //this.spinnerService.hide();
        }
      )
  };

  addNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%"
    let dialogRef = this.dialog.open(UserAddComponent, dialogConfig);
    this.Des1 = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAllUsers();
        }
      }
    },
      (error) => {
        this.commonService.showErrorMsg(JSON.stringify(error));
      }
    );
  }

  onEdit(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = row;
    let dialogRef = this.dialog.open(UserAddComponent, dialogConfig);
    this.Des2 = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAllUsers();
        }
      }
    },
      (error) => {
        this.commonService.showErrorMsg(JSON.stringify(error));
      }
    );
  }

  restoreUser(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.userService.restoreUser(row.userId).subscribe(
          (data) => {
            this.asyncService.finish();
            if (data) {
              if (data.isExecute === true) {
                this.commonService.showSuccessMsg(data.message);
                this.loadAllUsers();
              }
              else {
                this.commonService.showErrorMsg(data.message);
              }
            } else {
              this.commonService.showErrorMsg('System error !');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg(JSON.stringify(error));
          }
        );
      }
    })
  }

  deleteRow(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.userService.deleteUser(row.userId).subscribe(
          (data) => {
            this.asyncService.finish();
            if (data) {
              if (data.isExecute === true) {
                this.commonService.showSuccessMsgForDelete(data.message);
                this.loadAllUsers();
              }
              else {
                this.commonService.showErrorMsg(data.message);
              }
            } else {
              this.asyncService.finish();
              this.commonService.showErrorMsg('System error !');
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg(JSON.stringify(error));
          }
        );
      }
    })
  }

  ngOnDestroy(): void {
    if (this.deleteUser) {
      this.deleteUser.unsubscribe();
    }
    if (this.getAll) {
      this.getAll.unsubscribe();
    }
    if (this.Des1) {
      this.Des1.unsubscribe();
    }
    if (this.Des2) {
      this.Des2.unsubscribe();
    }
  }
}
