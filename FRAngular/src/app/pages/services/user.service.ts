import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  forReload = new Subject();
  ForReload(msg: any) {
    this.forReload.next(msg);
  }
  getAllUser(pageInfo: any): Observable<any> {
    const url = `/User/GetAll`;
    return this.http.post<any>(url, pageInfo);;
  }
  addUser(data: any): Observable<any> {
    const url = `/User/SignUp`;
    return this.http.post<any>(url, data)
    .pipe(catchError(this.handleError<any>('addUser', [])));
  }
  updateUser(data: any): Observable<any> {
    const url = `/User/Update`;
    return this.http.post<any>(url, data);
  }
  deleteUser(id: any): Observable<any> {
    const url = `/User/DeactivateUser/${id}`;
    return this.http.get<any>(url);
  }
  restoreUser(id: any): Observable<any> {
    const url = `/User/ActivateUser/${id}`;
    return this.http.get<any>(url);
  }
  getUserId(userId:any):Observable<any>{
    const url = `/User/get/${userId}`;
    return this.http.get<any>(url);
  }
  getUserIdToCheckDuplicate(userId:any):Observable<any>{
    const url = `/User/GetById?userId=${userId}`;
    return this.http.post<any>(url, null);
  }
  changePassword(userId:any,currentPassword:any):Observable<any>{
    const url = `/User/ChangePassword/${userId}/${currentPassword}`;
    return this.http.get<any>(url);
  }
  matchCurrentPassword(userId:any,currentPassword:any):Observable<any>{
    const url = `/User/CurrentPasswordMatcher/${userId}/${currentPassword}`;
    return this.http.get<any>(url);
  }
  getAllActiveUserForDropdown():Observable<any>{
    const url = `/User/GetAllActiveUserForDropdown`;
    return this.http.get<any>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
