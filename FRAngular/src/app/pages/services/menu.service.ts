import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }
  forReload = new Subject();
  ForReload(msg: any) {
    this.forReload.next(msg);
  }
  getFeatureCode(): Observable<any> {
    const url = `/Features/get-type-all`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getFeatureCode', [])));
  }

  getParentInfos(): Observable<any> {
    const url = `/UmsMenu/get-all-ParentInfos`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getAllParentInfos', [])));
  }

  getFilteredByFeature(pageInfo:any):Observable<any>{
    const url = `/UmsMenu/get-filtered-by-feature`;
    return this.http.post<any>(url,pageInfo);
  }
  getAllMenu(data?: any): Observable<any> {
    const url = `/Menu/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllMenu', [])));
  }
  getParentMenuForDropdown(): Observable<any> {
    const url = `/Menu/GetParentMenuForDropdown`;
    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError<any>('getParentMenuForDropdown', [])));
  }
  getNonMatchMenuByRoleDropdown(data: any): Observable<any> {
    const url = `/Menu/GetNonMatchMenuByRoleDropdown?roleId=${data}`;
    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError<any>('getNonMatchMenuByRoleDropdown', [])));
  }
  getNonMatchMenuByRoleWithSelectedMenuDropdown(roleId: any, menuId: any): Observable<any> {
    const url = `/Menu/GetNonMatchMenuByRoleWithSelectedMenuDropdown?roleId=${roleId}&menuId=${menuId}`;
    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError<any>('GetNonMatchMenuByRoleWithSelectedMenuDropdown', [])));
  }
  addMenu(data: any): Observable<any> {
    const url = `/Menu/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addMenu', [])));
  }
  updateMenu(data: any): Observable<any> {
    const url = `/Menu/Update`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('updateMenu', [])));
  }
  deleteMenu(id: any): Observable<any> {
    const url = `/Menu/Delete/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<Menu[]>('deleteMenu', [])));
  }
  restoreMenu(id: any): Observable<any> {
    const url = `/Menu/Restore/${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<Menu[]>('restoreMenu', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  // getAllMenu(pageInfo?:any): Observable<any> {
  //   return this.http.post<any[]>(this.baseURL, pageInfo);
  // }
  // getAlllMenu(pageInfo?:any){
  //   return this.http.post(this.baseURL, pageInfo);
  // }
  // addMenu(data:any){
  //   return this.http.post(this.baseURL, data)
  // }
}
