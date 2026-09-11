/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Response } from 'express';

export default class ResponseHandler {
  static send(
    res: Response,
    statusCode: number,
    resBody: {
      data?: any | null;
      message?: string | null;
      stack?: any | null;
    },
  ) {
    let response: any;

    if (!resBody.message && !resBody.stack && resBody.data) {
      response = resBody.data;
    } else {
      response = {
        ...(resBody.data && { payload: resBody.data }),
        ...(resBody.message && { message: resBody.message }),
        ...(resBody.stack && { stack: resBody.stack }),
      };
    }
    res.status(statusCode).json(response);
  }
}
