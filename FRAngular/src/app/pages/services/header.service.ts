import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  getAllHeaderByPage(data: any): Observable<any> {
    const url = `/Header/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllHeaderByPage', [])));
  }
  addHeader(data: any): Observable<any> {
    const url = `/Header/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addHeader', [])));
  }
  updateHeader(data: any): Observable<any> {
    const url = `/Header/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateHeader', [])));
  }
  deleteHeader(id: any): Observable<any> {
    const url = `/Header/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteHeader', [])));
  }
  restoreHeader(id: any): Observable<any> {
    const url = `/Header/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreHeader', [])));
  }
  getAllHeaderDropdown(): Observable<any>{
    const url = `/Header/GetAllForDropdown`;
    return this.http.get<any>(url);
  }
  getParentHeaderByTypeAndLayerForDropdown(header: any): Observable<any> {
    const url = `/Header/GetParentHeaderByTypeAndLayerForDropdown`;
    return this.http
      .post<any>(url, header)
      .pipe(catchError(this.handleError<any>('getParentHeaderByTypeAndLayerForDropdown', [])));
  }
  getHeaderCode(data: any): Observable<any> {
    const url = `/Header/GetHeaderCode`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getHeaderCode', [])));
  }
  getFirstHeaderByHeaderType(headerTypeId: any): Observable<any> {
    const url = `/Header/GetFirstHeaderByHeaderType/${headerTypeId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getFirstHeaderByHeaderType', [])));
  }
  getSecondHeaderByFirstHeader(headerId: any): Observable<any> {
    const url = `/Header/GetSecondHeaderByFirstHeader/${headerId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getSecondHeaderByFirstHeader', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
