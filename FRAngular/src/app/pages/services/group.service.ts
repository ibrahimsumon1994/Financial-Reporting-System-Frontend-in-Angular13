import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  getAllGroupByPage(data: any): Observable<any> {
    const url = `/Group/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllGroupByPage', [])));
  }
  addGroup(data: any): Observable<any> {
    const url = `/Group/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addGroup', [])));
  }
  updateGroup(data: any): Observable<any> {
    const url = `/Group/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateGroup', [])));
  }
  deleteGroup(id: any): Observable<any> {
    const url = `/Group/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteGroup', [])));
  }
  restoreGroup(id: any): Observable<any> {
    const url = `/Group/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreGroup', [])));
  }
  getAllGroupDropdown(): Observable<any>{
    const url = `/Group/GetAllForDropdown`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
