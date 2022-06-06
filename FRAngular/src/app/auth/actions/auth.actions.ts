import { Auth } from '../models/auth.model';

export class Login {
  static readonly type = '[AUTH] login';

  constructor(public payload: Auth) {}
}

export class Logout {
  static readonly type = '[AUTH] logout';
}
