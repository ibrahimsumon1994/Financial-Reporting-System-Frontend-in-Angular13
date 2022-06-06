import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  getAllDepartmentByPage(data: any): Observable<any> {
    const url = `/Department/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllDepartmentByPage', [])));
  }
  addDepartment(data: any): Observable<any> {
    const url = `/Department/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addDepartment', [])));
  }
  updateDepartment(data: any): Observable<any> {
    const url = `/Department/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateDepartment', [])));
  }
  deleteDepartment(id: any): Observable<any> {
    const url = `/Department/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteDepartment', [])));
  }
  restoreDepartment(id: any): Observable<any> {
    const url = `/Department/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreDepartment', [])));
  }
  getAllDepartmentDropdown(): Observable<any> {
    const url = `/Department/GetAllForDropdown`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getAllDepartmentDropdown', [])));
  }
  getDepartmentByUnit(unitId: any): Observable<any>{
    const url = `/Department/GetByUnitForDropdown/${unitId}`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
