import { Async } from '../models/async.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { StartAsyncLoad, FinishAsyncLoad } from '../actions/async.actions';

export class AsyncStateModel {
  async!: Async;
}

@State<AsyncStateModel>({
  name: 'async',
  defaults: {
    async: {
      loading: false
    }
  }
})
export class AsyncState {
  @Selector()
  static isLoading(state: AsyncStateModel) {
    return state.async.loading;
  }

  @Action(StartAsyncLoad)
  startAsyncLoad(
    { setState }: StateContext<AsyncStateModel>,
    {  }: StartAsyncLoad
  ) {
    setState({
      async: { loading: true }
    });
  }

  @Action(FinishAsyncLoad)
  finishAsyncLoad(
    { setState }: StateContext<AsyncStateModel>,
    {  }: FinishAsyncLoad
  ) {
    setState({
      async: { loading: false }
    });
  }
}
