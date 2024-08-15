import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(data: any, message: string = 'Success',statusCode: number = 200) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  error(message: string, error: any = null, statusCode: number = 400) {
    return {
      success: false,
      message,
      error,
      statusCode,
    };
  }
}
