export interface IContainer<T = any> {
  data: T;
  message: string;
  isExecuted: boolean;
}
