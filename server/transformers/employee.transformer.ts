export const EmployeeTransformer = {
  transform: (e: any) => ({
    id: e.id, name: e.name, email: e.email,
    companyId: e.companyId, departmentId: e.departmentId, positionId: e.positionId,
    roleId: e.roleId
  }),
  collection: (arr: any[]) => arr.map(EmployeeTransformer.transform)
}
