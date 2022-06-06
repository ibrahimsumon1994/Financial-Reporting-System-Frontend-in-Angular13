import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonCode } from '../models/common-code.model';

@Injectable({
  providedIn: 'root'
})
export class CommonCodeService {

  constructor(private http: HttpClient) { }

  formReload = new Subject();
  ForReload(msg: any) {
    this.formReload.next(msg);
  }
  getAllCommonCodeByPage(data: any): Observable<any> {
    const url = `/CommonCode/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllCommonCodeByPage', [])));
  }
  addCommonCode(data: any): Observable<any> {
    const url = `/CommonCode/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addCommonCode', [])));
  }
  updateCommonCode(data: any): Observable<any> {
    const url = `/CommonCode/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateCommonCode', [])));
  }
  deleteCommonCode(id: any): Observable<any> {
    const url = `/CommonCode/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteCommonCode', [])));
  }
  restoreCommonCode(id: any): Observable<any> {
    const url = `/CommonCode/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreCommonCode', [])));
  }
  getCommonCodeForDropdown(data: any): Observable<any> {
    const url = `/CommonCode/GetByType?type=${data}`;
    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError<any>('getAllCommonCode', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
