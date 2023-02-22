import { APIBaseError } from '../../errors/errors.common'

export interface INextFunction {
  (error?: APIBaseError): void;
}

export interface IControllerResponse{
  ok: boolean,
  status: number,
  msg?: Object,
}

export interface IControllerRequest{
  // TODO: BODY AND PARAMS MUST BE RECORDS
  body: Object,
  params?: Object,
  headers?: Record<string, string | string[] | number | undefined>
}

export abstract class BaseController {
  public abstract processRequest(req: IControllerRequest, next: INextFunction): Promise<IControllerResponse> | IControllerResponse
}
