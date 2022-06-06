import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceSetup } from '../models/application.model';
import { AssignRole } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class UserWiseUnitPermissionService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }
  getAllUserWiseUnitPermissionByPage(data: any): Observable<any> {
    const url = `/UserWiseUnitPermission/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllUserWiseUnitPermissionByPage', [])));
  }
  addUserWiseUnitPermission(data: any): Observable<any> {
    const url = `/UserWiseUnitPermission/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addUserWiseUnitPermission', [])));
  }
  updateUserWiseUnitPermission(data: any): Observable<any> {
    const url = `/UserWiseUnitPermission/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateUserWiseUnitPermission', [])));
  }
  deleteUserWiseUnitPermission(id: any): Observable<any> {
    const url = `/UserWiseUnitPermission/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteUserWiseUnitPermission', [])));
  }
  getUserWiseUnitForDropdown(userId: any): Observable<any>{
    const url = `/UserWiseUnitPermission/GetUserWiseUnitForDropdown/${userId}`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
