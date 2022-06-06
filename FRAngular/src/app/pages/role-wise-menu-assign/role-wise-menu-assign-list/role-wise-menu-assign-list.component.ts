import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RoleWiseMenuAssignAddComponent } from '../role-wise-menu-assign-add/role-wise-menu-assign-add.component';
import { RoleWiseMenuAssignService } from '../../services/role-wise-menu-assign.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { forkJoin, merge, of, Subscription, throwError } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'role-wise-menu-assign-list',
  templateUrl: './role-wise-menu-assign-list.component.html',
  styleUrls: ['./role-wise-menu-assign-list.component.scss']
})
export class RoleWiseMenuAssignListComponent implements AfterViewInit {
  length: any;
  displayedColumns: string[] = ['sl', 'role', 'menuName', 'create', 'edit', 'view', 'delete', 'authorization', 'recstatus', 'actions'];
  searchString: string = '';
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  Des1!: Subscription;
  Des2!: Subscription;
  constructor(
    public dialog: MatDialog,
    public roleWiseMenuAssignService: RoleWiseMenuAssignService,
    public asyncService: AsyncService,
    private commonService: CommonService) { }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.searchString = filterValue;
    this.loadAssignedMenus();
  }

  ngAfterViewInit() {
    this.loadAssignedMenus();
  }

  loadAssignedMenus = (): void => {
    if(this.searchString)
    {
      this.paginator.pageIndex = 0;
    }
    this.paginator.page.subscribe((resp) => { }
    );
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.asyncService.start();
          return this.roleWiseMenuAssignService.getAllRoleWiseMenuAssign(
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
    dialogConfig.width = "60%";
    dialogConfig.height = '70%';
    let dialogRef = this.dialog.open(RoleWiseMenuAssignAddComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAssignedMenus();
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
    dialogConfig.height = '40%';
    dialogConfig.data = row;
    let dialogRef = this.dialog.open(RoleWiseMenuAssignAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAssignedMenus();
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
        this.asyncService.start();
        this.roleWiseMenuAssignService.deleteRoleWiseMenuAssign(row.roleWiseMenuAssignId).subscribe(
          (data) => {
            if (data) {
              if (data.isExecute === true) {
                this.asyncService.finish();
                this.commonService.showSuccessMsgForDelete(data.message);
                this.loadAssignedMenus();
              }
              else {
                this.asyncService.finish();
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
}
