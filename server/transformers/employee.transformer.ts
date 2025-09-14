export const EmployeeTransformer = {
  one: (e: any) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    serviceName: e.serviceName,
    companyId: e.companyId,
    departmentId: e.departmentId,
    positionId: e.positionId,
    roleId: e.roleId,
  })
}
