import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IContainer } from "../models/api-container.model";
import { IdentityResult } from "../models/identity-result.model";

@Injectable()
export class AsyncValidationService {
  constructor(private http: HttpClient) {}

  isIdentityValid(prop: { [name: string]: string }): Observable<boolean> {
    const data = Object.entries(prop)
      .reduce((total, current) => current)
      .join(":");
    const body = { text: data };
    return this.http
      .post<IContainer<any>>("/validation", body)
      .pipe(
        map(response =>
          response.isExecuted && response.data && response.data.isValid
            ? response.data.isValid
            : false
        )
      );
  }
}
