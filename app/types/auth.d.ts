import { Employee as PrismaEmployee } from '@prisma/client'

export type Employee = Omit<PrismaEmployee, 'passwordHash'>

export interface AuthResponse {
  success: boolean;
  data?: { token: string };
  error?: { message: string };
}
