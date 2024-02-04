export enum ServiceErrorKey {
  NotFound = 'notFound',
  AlreadyExists = 'alreadyExists',
  Forbidden = 'forbidden',
  Unauthorized = 'unauthorized',
  WrongPassword = 'wrongPassword',
}

type ServiceErrorValue = {
  statusCode: number;
  message: string;
};

const ServiceErrors: Record<ServiceErrorKey, ServiceErrorValue> = {
  [ServiceErrorKey.NotFound]: {
    statusCode: 404,
    message: 'Resource is not found',
  },
  [ServiceErrorKey.AlreadyExists]: {
    statusCode: 409,
    message: 'Resource already exists',
  },
  [ServiceErrorKey.Forbidden]: {
    statusCode: 403,
    message: 'User does not have permission to change this resource',
  },
  [ServiceErrorKey.Unauthorized]: {
    statusCode: 401,
    message: 'User is unauthorized to do this action',
  },
  [ServiceErrorKey.WrongPassword]: {
    statusCode: 401,
    message: 'User has entered a wrong password',
  },
} as const;

export class ServiceError extends Error {
  statusCode: number;

  constructor(key: ServiceErrorKey) {
    const { message, statusCode } = ServiceErrors[key];
    super(message);
    this.statusCode = statusCode;
  }
}
