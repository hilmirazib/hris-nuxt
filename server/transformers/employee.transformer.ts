import type { Employee } from '@prisma/client'

export const EmployeeTransformer = {
  one: (e: Employee) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    serviceName: e.serviceName,
    companyId: e.companyId,
    departmentId: e.departmentId,
    positionId: e.positionId,
    roleId: e.roleId,
  }),
  collection: (employees: Employee[]) => employees.map((e) => EmployeeTransformer.one(e))
}
