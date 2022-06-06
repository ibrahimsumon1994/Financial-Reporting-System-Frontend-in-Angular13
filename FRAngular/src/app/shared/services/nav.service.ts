import { Injectable } from "@angular/core";
import { Event, Router, NavigationEnd } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NavService {
  public appDrawer!: MatSidenav;
  public currentUrl = new BehaviorSubject<string|null>(null);
  //headers = new HttpHeaders().set('appId', 'UMS');

  constructor(private router: Router,private http: HttpClient) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  getNav(userId:any):Observable<any>{
    const url = `/UmsMenu/getUserId/${userId}`;
    return this.http.get<any>(url)
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  public toggle() {
    this.appDrawer.toggle();
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
