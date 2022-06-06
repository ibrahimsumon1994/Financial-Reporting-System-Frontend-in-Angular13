import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleWiseMenuAssignService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  //service-setup-api-calling by sandil azad Start
  getAllModule(): Observable<any> {
    const url = `/ModuleSetup/get-type-all`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getAllModule', [])));
  }

  getApplicationByPage(data?: any): Observable<any> {
    const url = `/Application/GetAll`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getApplicationByPage', [])));
  }
  getModuleCode(id: any): Observable<any> {
    const url = `/ModuleSetup/get-module-code/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getApplicationByPage', [])));
  }

  getFeatureCode(myModuleCode: any, myRoleId: any): Observable<any> {
    const url = `/Features/get-feature-code/${myModuleCode}/${myRoleId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getFeatureCode', [])));
  }
  getFeatureCodeForEdit(myModuleCode: any, myRoleId: any, myFeatureCode: any): Observable<any> {
    const url = `/Features/get-feature-code/${myModuleCode}/${myRoleId}}/${myFeatureCode}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getFeatureCode', [])));
  }
  getRoleCode(): Observable<any> {
    const url = `/Role/GetAll/`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getRoleCode', [])));
  }
  getAllRoleWiseMenuAssign(data: any): Observable<any> {
    const url = `/RoleWiseMenuAssign/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllRoleWiseMenuAssign', [])));
  }
  getModuleById(data:any, id: any): Observable<any> {
    const url = `ModuleSetup/GetById/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getModuleById', [])));
  }
  updateRoleWiseMenuAssign(data: any): Observable<any> {
    const url = `/RoleWiseMenuAssign/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateRoleWiseMenuAssign', [])));
  }
  addrolewiseMenuAssign(data: any): Observable<any> {
    const url = `/RoleWiseMenuAssign/AddList`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addrolewiseMenuAssign', [])));
  }
  deleteRoleWiseMenuAssign(id: any): Observable<any> {
    const url = `/RoleWiseMenuAssign/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteRoleWiseMenuAssign', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  //service-setup-api-calling by sandil azad END
}
