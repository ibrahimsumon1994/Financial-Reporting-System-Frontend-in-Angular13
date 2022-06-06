import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) { }

  forReload = new Subject();
  ForReload(msg: any) {
    this.forReload.next(msg);
  }
  // headers = new HttpHeaders().set('content-type', 'application/json')

  getAllRole(data?: any): Observable<any> {
    const url = `/Role/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllRole', [])));
  }
  addRole(data: any): Observable<any> {
    const url = `/Role/Add/`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addRole', [])));
  }
  updateRole(data: any): Observable<any> {
    const url = `/Role/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateRole', [])));
  }
  deleteRole(id: any): Observable<any> {
    const url = `/Role/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteRole', [])));
  }
  restoreRole(id: any): Observable<any> {
    const url = `/Role/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreRole', [])));
  }

  getRoleForDropdown(): Observable<any> {
    return this.http.get<any>(`/Role/GetAllForDropdown`)
    .pipe(catchError(this.handleError<any[]>('getRoleList', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
