// D:/development/nuxt/hris-app/server/transformers/employee.transformer.ts

export const EmployeeTransformer = {
  transform: (employee: any) => {
    return {
      id: employee.id,
      email: employee.email,
      // Tambahkan properti lain yang relevan dari objek employee
      // Contoh:
      // firstName: employee.firstName,
      // lastName: employee.lastName,
      // position: employee.position,
    };
  },

  collection: (employees: any[]) => {
    return employees.map((employee) => EmployeeTransformer.transform(employee));
  },
};