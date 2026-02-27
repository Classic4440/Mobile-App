import { ErrorUtils } from 'react-native';

interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: string;
}

class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50;

  captureError(error: Error | string, context?: string) {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };

    console.error(`[${context || 'ERROR'}]`, errorInfo);
    this.errors.push(errorInfo);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }

  getErrors(): ErrorInfo[] {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  logErrorSummary() {
    console.log('=== Error Summary ===');
    console.log(`Total errors logged: ${this.errors.length}`);
    this.errors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.timestamp}] ${error.message}`);
    });
  }
}

export const errorHandler = new ErrorHandler();

export const setupGlobalErrorHandler = () => {
  const originalErrorHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    errorHandler.captureError(error, 'GlobalError');
    if (isFatal) {
      console.log('Fatal error occurred:', error);
    }
    originalErrorHandler(error, isFatal);
  });
};
