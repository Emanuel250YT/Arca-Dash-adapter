/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// API MESSAGES
export const APIMessages = {
  OK: "OK",
  UnAuthorized: "Unauthorized",
  BadRequest: "Bad request",
  NotFound: "Not found",
  InternalServerError: "Internal server error",
  Success: "Success",
  InvalidCaptcha: "Invalid captcha",
  ResourceAlreadyExists: "Resource already exists",
}

export type APIMessagesType = typeof APIMessages[keyof typeof APIMessages];


export interface IAPIMessages {
  message: string | APIMessagesType
}
// -------------------------------

// API CODES
export const APICodes = {
  200: 200, //OK
  400: 400, //BAD REQUEST
  500: 500, //INTERNAL SERVER ERROR
  401: 401, //UNAUTHORIZED
  404: 404, //NOT FOUND
  409: 409, //CONFLICT
}

export type APICodesType = typeof APICodes[keyof typeof APICodes];


export interface IAPICodes {
  code: number | APICodesType
}

// ------------------------------

// API STATUS

export const APIStatus = {
  BadRequest: "Bad request",
  Error: "Error",
  Success: "Success",
  InternalServerError: "Internal server error",
  Unauthorized: "Unauthorized",
  OK: "OK",
  NotFound: "Not found",
  Conflict: "Conflict",
}

export type APIStatusType = typeof APIStatus[keyof typeof APIStatus];

// -------------------------

export interface IAPIResponse extends IAPIMessages, IAPICodes {
  status: APIStatusType | string
  body: { [key: string]: any; } | null
}

export class APIResponse implements IAPIResponse {
  code: number;
  message: string;
  status: string;
  body: { [key: string]: any; };

  constructor(data: IAPIResponse) {
    this.code = data.code ?? APICodes[200]
    this.message = data.message ?? APIStatus.OK
    this.status = data.status ?? APIStatus.OK
    this.body = data.body ?? {}
  }

  response() {
    return NextResponse.json({
      body: this.body,
      code: this.code,
      status: this.code,
      message: this.message
    }, { status: this.code, statusText: this.status })
  }
}
