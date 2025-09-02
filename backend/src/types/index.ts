import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export type OperationType = 'buy' | 'sell';

export interface CreateOperationRequest {
  type: OperationType;
  amount: number;
  currency: string;
}

export interface OperationResponse {
  id: string;
  type: OperationType;
  amount: number;
  currency: string;
  createdAt: Date;
}
