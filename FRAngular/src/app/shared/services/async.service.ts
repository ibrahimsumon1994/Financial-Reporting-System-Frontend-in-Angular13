import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AsyncState } from '../state/async.state';
import { StartAsyncLoad, FinishAsyncLoad } from '../actions/async.actions';

@Injectable()
export class AsyncService {
  @Select(AsyncState.isLoading) isLoading!: Observable<boolean>;

  constructor(private store: Store) {}

  start(): void {
    this.store.dispatch(new StartAsyncLoad());
  }

  finish(): void {
    this.store.dispatch(new FinishAsyncLoad());
  }
}
