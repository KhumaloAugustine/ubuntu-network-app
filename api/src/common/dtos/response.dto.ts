export class ApiResponseDTO<T> {
  data: T;
  message?: string;
  timestamp: string;

  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

export class SuccessDTO {
  success: boolean;
  message: string;
  timestamp: string;

  constructor(message: string) {
    this.success = true;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
