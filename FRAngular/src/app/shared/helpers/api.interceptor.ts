import { Injectable, Inject, OnInit, OnDestroy } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, Subscription, throwError } from "rxjs";
import { retry, catchError, map } from "rxjs/operators";
import { AuthService } from '../../auth/auth.service';
// import { IContainer } from '../models/api-container.model';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  //token: any;
  constructor(@Inject("BASE_API_URL") private baseUrl: string) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(request.url.startsWith("http"))
    {
      request = request.clone({ url: `${request.url}` });
    }
    else
    {
      request = request.clone({ url: `${this.baseUrl}${request.url}` });
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json")
      });
      request = request.clone({
        headers: request.headers.set("Accept", "application/json")
      });
      request = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${localStorage.getItem('token')}`)
      });
    }
    // Use for middleware
    return next.handle(request).pipe(
      retry(0),
      // map(response => {
      //   return response.isExecuted && response.data ? response.data: null;
      // }),
      catchError((error: HttpErrorResponse) => {
        // if (error.status === 401) {

        //   // refresh token
        // } else {
        //   return throwError(error);
        // }
        return throwError(error);
      })
    );
  }
}
