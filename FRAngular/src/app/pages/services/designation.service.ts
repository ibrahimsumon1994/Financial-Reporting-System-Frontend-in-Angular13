import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  getAllDesignationByPage(data: any): Observable<any> {
    const url = `/Designation/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllDesignationByPage', [])));
  }
  addDesignation(data: any): Observable<any> {
    const url = `/Designation/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addDesignation', [])));
  }
  updateDesignation(data: any): Observable<any> {
    const url = `/Designation/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateDesignation', [])));
  }
  deleteDesignation(id: any): Observable<any> {
    const url = `/Designation/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteDesignation', [])));
  }
  restoreDesignation(id: any): Observable<any> {
    const url = `/Designation/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreDesignation', [])));
  }
  getAllDesignation(): Observable<any>{
    const url = `/Designation/GetAllForDropdown`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
