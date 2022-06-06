import { Observable } from 'rxjs';

export declare interface IDataSourceService {
  load: (pageIndex: number, pageSize: number, all: boolean) => Observable<any>;
  search: (
    payload: any,
    pageIndex: number,
    pageSize: number,
    all: boolean,
    paginated: boolean
  ) => Observable<any>;
}
