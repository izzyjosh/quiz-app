export interface IValidationError {
  msg: string;
  type?: string;
  path: string;
  location?: string;
}
