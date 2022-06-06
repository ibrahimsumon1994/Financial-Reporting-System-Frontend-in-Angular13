import { ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { AsyncService } from './shared/services/async.service';
import { CommonService } from './shared/services/common.service';
import { NavService } from './shared/services/nav.service';
import { SharedModule } from './shared/shared.module';
import { NgxsModule } from "@ngxs/store";
import { AuthState } from './auth/state/auth.state';
import { AsyncState } from './shared/state/async.state';
import { environment } from 'src/environments/environment';
import { GlobalErrorHandler } from './shared/helpers/global-error-handler';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './shared/helpers/api.interceptor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PagesComponent } from './pages/pages.component';
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent

  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    NgxsModule.forRoot([AuthState, AsyncState], {
      developmentMode: !environment.production,
    }),
    FlexLayoutModule,
    NgxsStoragePluginModule.forRoot(),
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      },
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthService,
    AsyncService,
    CommonService,
    NavService,
    AuthGuard,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: OverlayContainer},
    { provide: "BASE_API_URL", useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
