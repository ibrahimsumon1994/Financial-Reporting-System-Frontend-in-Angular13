import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from '../shared/services/common.service';

@Injectable()
export class AuthGuard implements CanActivate {
  menuRoute: any;
  allMenuListJson: any;
  allMenuList: any;
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    const currentRoute = route.url.find((cs) => cs.path != null);
    if(currentRoute)
    {
      this.menuRoute = currentRoute.path
    }
    if(!token)
    {
      this.router.navigate(['auth']);
      return of(true);
    }
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      //return of(true);
      return this.authService.menuLocationList.pipe(
        take(1),
        map((data: any) => {
          if (data)
          {
            if(this.menuRoute)
            {
              const router = data.find((option:any) => option.menuLocation == this.menuRoute);
              if(router)
              {
                return true;
              }
              else
              {
                this.router.navigate(['']);
                return false;
              }
            }
            else
            {
              this.router.navigate(['']);
              return false;
            }
          }
          else
          {
            this.router.navigate(['']);
            return false;
          }
        }
      ));
    }
    return this.tryRefreshingTokens(token).pipe(
      take(1),
      map((isRefreshSuccess: boolean) => {
        if (!isRefreshSuccess) {
          this.router.navigate(['auth']);
          //return isRefreshSuccess
          return false;
        }
        else
        {
          this.allMenuListJson = localStorage.getItem('menuList');
          this.allMenuList = JSON.parse(this.allMenuListJson);
          const router = this.allMenuList.find((option:any) => option.menuLocation == this.menuRoute);
          if(router)
          {
            return true;
          }
          else
          {
            this.router.navigate(['']);
            return false;
          }
        }
      })
    );
  }
  private tryRefreshingTokens(token: any): Observable<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) {
      return of(false);
    }
    const credentials = JSON.stringify({
      AccessToken: token,
      RefreshToken: refreshToken,
    });
    return this.authService.refreshToken(credentials).pipe(
      take(1),
      map((data: any) => {
        if (data)
        {
          if(data.isExecute)
          {
            localStorage.setItem('token', data.apiData.token);
            localStorage.setItem('refreshToken', data.apiData.refreshToken);
            return true;
          }
          else
          {
            this.commonService.showErrorMsg(data.message);
            return false;
          }
        }
        else
        {
          this.commonService.showErrorMsg("Server error !");
          return false;
        }
      }
    ));
  }
  // private tryRefreshingTokens(token: any): Observable<boolean> {
  //   // Try refreshing tokens using refresh token
  //   var subject = new Subject<boolean>();

  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (!token || !refreshToken) {
  //     // return false;
  //     subject.next(false);
  //   }
  //   const credentials = JSON.stringify({
  //     AccessToken: token,
  //     RefreshToken: refreshToken,
  //   });
  //   let isRefreshSuccess: boolean = false;

  //   this.authService.refreshToken(credentials).subscribe((data) => {
  //     if (data && data.isExecute) {
  //       localStorage.setItem('token', data.apiData.token);
  //       localStorage.setItem('refreshToken', data.apiData.refreshToken);
  //       subject.next(true);
  //       isRefreshSuccess = true;
  //       // return true;
  //     } else {
  //       isRefreshSuccess = false;
  //       subject.next(false);
  //       // return false;
  //     }
  //   });
  //   return subject.asObservable(); //tmr kase amn kono kaj kora nai?
  // }
}
