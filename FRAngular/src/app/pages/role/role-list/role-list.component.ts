import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Role } from '../../models/application.model';
import { RoleService } from '../../services/role.service';
import { RoleAddComponent } from '../role-add/role-add.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit , AfterViewInit{
  displayedColumns: string[] = [
    'sl',
    'roleName',
    'purpose',
    'recStatus',
    'actions',
  ];
  searchString: string = '';
  dataSource= new MatTableDataSource<any>();
  length:any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  constructor(
    public dialog: MatDialog,
    public roleService: RoleService,
    public asyncService: AsyncService,
    private commonService: CommonService
  ) {}
  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.searchString = filterValue;
    this.getAllRole();
  }
  ngOnInit() : void{
    // this.getAllRole;
    // this.dataSource.paginator = this.paginator;
    // this.roleService.forReload.subscribe((msg) => {
    //   if (msg) {
    //     this.getAllRole();
    //   }
    // });
  }
  ngAfterViewInit() {
    this.getAllRole();
    //this.dataSource.paginator = this.paginator;
  }
  getAllRole = (): void => {
    if(this.searchString)
    {
      this.paginator.pageIndex = 0;
    }
    this.paginator.page.subscribe((resp) => {}
    );
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.asyncService.start();
          return this.roleService.getAllRole(
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
          return data;
        })
      )
      .subscribe(
        data => {
          this.length = data.totalRecord;
          this.dataSource.data = data.apiData;
          this.asyncService.finish();
        }
      );
  };

  addNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    let dialogRef = this.dialog.open(RoleAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.getAllRole();
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
    dialogConfig.width = '60%';
    dialogConfig.data = row;
    let dialogRef = this.dialog.open(RoleAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.getAllRole();
        }
      }
    },
      (error) => {
        this.commonService.showErrorMsg(JSON.stringify(error));
      }
    );
  }
  deleteRow(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.roleService.deleteRole(row.roleId).subscribe(
          (data) => {
            this.asyncService.finish();
            if (data) {
              if (data.isExecute === true) {
                this.commonService.showSuccessMsgForDelete(data.message);
                this.getAllRole();
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
  restoreRow(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.roleService.restoreRole(row.roleId).subscribe(
          (data) => {
            this.asyncService.finish();
            if (data) {
              if (data.isExecute === true) {
                this.commonService.showSuccessMsg(data.message);
                this.getAllRole();
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
  reloadPage() {
    window.location.reload();
  }
  ngOnDestroy(): void {
    // if (this.getAll) {
    //   this.getAll.unsubscribe();
    // }
  }
}
