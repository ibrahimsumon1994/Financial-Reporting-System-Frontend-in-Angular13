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
export class AssignRoleService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  //service-setup-api-calling by sandil azad Start

  getAllAssignedRole(): Observable<any> {
    const url = `/api/RoleAssign/get-all`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getAllAssignedRole', [])));
  }

  getAllAssignedRoleByPage(data: any): Observable<any> {
    const url = `/RoleAssign/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllAssignedRoleByPage', [])));
  }
  addAssignRole(data: any): Observable<any> {
    const url = `/RoleAssign/add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addRoleAssign', [])));
  }

  getRoleAssignById(data: ServiceSetup, id: any): Observable<ServiceSetup[]> {
    const url = `ModuleSetup/GetById/${id}`;
    return this.http
      .get<ServiceSetup[]>(url)
      .pipe(catchError(this.handleError<ServiceSetup[]>('getModuleById', [])));
  }
  // updateRoleAssign(data: ServiceSetup): Observable<any> {
  //   const url = `/ModuleSetup/Update?`;
  //   return this.http
  //     .put<any>(url, data)
  //     .pipe(catchError(this.handleError<any>('getModuleUpdate', [])));
  // }
  updateRoleAssign(data: any): Observable<any> {
    const url = `/RoleAssign/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateRoleAssign', [])));
  }
  deleteAssignedRole(id: any): Observable<any> {
    const url = `/RoleAssign/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<AssignRole[]>('deleteAssignedRole', [])));
  }
  getUserIDList(searchText: string): Observable<any> {
    return this.http.get<any>(`/RoleAssign/autoCompleteUserID?param=${searchText}`).pipe(
      map((response) => (response ? response.apiData : null)),
      catchError((error) => of(null))
    );
  }

  deleteModule(id: any): Observable<ServiceSetup[]> {
    const url = `/ModuleSetup/delete/${id}`;
    return this.http
      .get<any[]>(url)
      .pipe(catchError(this.handleError<ServiceSetup[]>('deleteModule', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  //service-setup-api-calling by sandil azad END
}
