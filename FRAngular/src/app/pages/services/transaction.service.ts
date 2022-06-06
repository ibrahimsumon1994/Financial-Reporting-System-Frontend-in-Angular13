import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) { }

  forReload = new Subject();
  ForReload(msg: any) {
    this.forReload.next(msg);
  }
  // headers = new HttpHeaders().set('content-type', 'application/json')

  addOrUpdateTransaction(data?: any): Observable<any> {
    const url = `/Transaction/AddOrUpdate`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addOrUpdateTransaction', [])));
  }
  addOrUpdateTransactionFromExcel(data?: any): Observable<any> {
    const url = `/Transaction/AddOrUpdateFromExcel`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addOrUpdateTransactionFromExcel', [])));
  }
  getItemsWithDataBySecondHeader(data: any): Observable<any> {
    const url = `/Transaction/GetItemsWithDataBySecondHeader`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getItemsWithDataBySecondHeader', [])));
  }
  getAllHeaderItemsWithDataByHeaderType(data: any): Observable<any> {
    const url = `/Transaction/GetAllHeaderItemsWithDataByHeaderType`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllHeaderItemsWithDataByHeaderType', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
