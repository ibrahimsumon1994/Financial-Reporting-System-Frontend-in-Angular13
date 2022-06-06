import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  getAllUnitByPage(data: any): Observable<any> {
    const url = `/Unit/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllUnitByPage', [])));
  }
  addUnit(data: any): Observable<any> {
    const url = `/Unit/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addUnit', [])));
  }
  updateUnit(data: any): Observable<any> {
    const url = `/Unit/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateUnit', [])));
  }
  deleteUnit(id: any): Observable<any> {
    const url = `/Unit/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('deleteUnit', [])));
  }
  restoreUnit(id: any): Observable<any> {
    const url = `/Unit/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('restoreUnit', [])));
  }
  getAllUnit(): Observable<any>{
    const url = `/Unit/GetAllForDropdown`;
    return this.http.get<any>(url);
  }
  getUnitByGroup(groupId: any): Observable<any>{
    const url = `/Unit/GetByGroupForDropdown/${groupId}`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
