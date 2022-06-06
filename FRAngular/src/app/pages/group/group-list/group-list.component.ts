import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { merge, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { GroupAddComponent } from '../group-add/group-add.component';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements AfterViewInit {
  length: any;
  displayedColumns: string[] = ['sl', 'nameBangla', 'nameEnglish', 'recStatus', 'actions'];
  searchString: string = '';
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  constructor(
    public dialog: MatDialog,
    public groupService: GroupService,
    public asyncService: AsyncService,
    private commonService: CommonService
  ) { }
  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.searchString = filterValue;
    this.loadAllGroups();
  }
  ngAfterViewInit() {
    this.loadAllGroups();
  }
  loadAllGroups = (): void => {
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
          return this.groupService.getAllGroupByPage(
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
    dialogConfig.width = "60%"
    let dialogRef = this.dialog.open(GroupAddComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAllGroups();
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
    let dialogRef = this.dialog.open(GroupAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if(res.isExecute)
        {
          this.loadAllGroups();
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
        this.groupService.deleteGroup(row.groupId).subscribe(
          (data) => {
            if (data) {
              if (data.isExecute === true) {
                this.asyncService.finish();
                this.commonService.showSuccessMsgForDelete(data.message);
                this.loadAllGroups();
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
  restoreRow(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.height = "30%";
    let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirm") {
        this.groupService.restoreGroup(row.groupId).subscribe(
          (data) => {
            this.asyncService.finish();
            if (data) {
              if (data.isExecute === true) {
                this.commonService.showSuccessMsg(data.message);
                this.loadAllGroups();
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
}
