export interface JwtPayload {
  name: string;
}

export class LoginDto {
  readonly name: string = '';
  readonly password: string = '';
}
