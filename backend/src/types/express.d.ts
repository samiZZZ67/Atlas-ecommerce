import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductQuery extends PaginationQuery {
  category?: string;
  search?: string;
  sort?: string;
  filter?: string;
  sale?: string;
}
