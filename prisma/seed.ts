/* eslint-disable */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1) Company (induk + anak contoh)
  const hq = await prisma.company.upsert({
    where: { acronym: 'HQ' },
    update: {},
    create: {
      name: 'Headquarters',
      acronym: 'HQ',
      color: '#2E7D32',
      logo: null,
      parentId: null,
    },
  })

  const div = await prisma.company.upsert({
    where: { acronym: 'DIV' },
    update: {},
    create: {
      name: 'Division A',
      acronym: 'DIV',
      color: '#1565C0',
      parentId: hq.id,
    },
  })

  // 2) Department
  const depHR = await prisma.department.upsert({
    where: { id: 1 }, // ganti dengan constraint unikmu sendiri kalau perlu
    update: {},
    create: {
      name: 'Human Resources',
      acronym: 'HR',
      companyId: hq.id,
    },
  })

  const depIT = await prisma.department.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Information Technology',
      acronym: 'IT',
      companyId: hq.id,
    },
  })

  // 3) Position
  const posAdmin = await prisma.position.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Administrator',
      level: 100, // level tinggi = super
      acronym: 'ADM',
      companyId: hq.id,
    },
  })

  const posStaff = await prisma.position.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Staff',
      level: 10,
      acronym: 'STF',
      companyId: hq.id,
    },
  })

  // 4) Role (global template)
  const roleAdmin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Admin',
      acronym: 'ADMIN',
    },
  })

  const roleStaff = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Employee',
      acronym: 'EMP',
    },
  })

  // 5) Permissions (contoh)
  const pManageUsers = await prisma.permission.upsert({
    where: { slug: 'users.manage' },
    update: {},
    create: { slug: 'users.manage', description: 'Manage employees', category: 'users' },
  })
  const pViewUsers = await prisma.permission.upsert({
    where: { slug: 'users.view' },
    update: {},
    create: { slug: 'users.view', description: 'View employees', category: 'users' },
  })
  const pManageOrg = await prisma.permission.upsert({
    where: { slug: 'org.manage' },
    update: {},
    create: { slug: 'org.manage', description: 'Manage companies/departments/positions', category: 'org' },
  })

  // 6) Role ↔ Permission
  // Admin: semua
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: pManageUsers.id } },
    update: {},
    create: { roleId: roleAdmin.id, permissionId: pManageUsers.id },
  })
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: pViewUsers.id } },
    update: {},
    create: { roleId: roleAdmin.id, permissionId: pViewUsers.id },
  })
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: pManageOrg.id } },
    update: {},
    create: { roleId: roleAdmin.id, permissionId: pManageOrg.id },
  })

  // Staff: hanya view users
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleStaff.id, permissionId: pViewUsers.id } },
    update: {},
    create: { roleId: roleStaff.id, permissionId: pViewUsers.id },
  })

  // 7) Role ↔ Company / Department (kontekstual)
  await prisma.roleCompany.upsert({
    where: { roleId_companyId: { roleId: roleAdmin.id, companyId: hq.id } },
    update: {},
    create: { roleId: roleAdmin.id, companyId: hq.id },
  })
  await prisma.roleDepartment.upsert({
    where: { roleId_departmentId: { roleId: roleAdmin.id, departmentId: depHR.id } },
    update: {},
    create: { roleId: roleAdmin.id, departmentId: depHR.id },
  })

  // 8) Admin employee
  const passwordHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.employee.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      passwordHash,
      serviceName: 'admin',
      companyId: hq.id,
      departmentId: depHR.id,
      positionId: posAdmin.id,
      roleId: roleAdmin.id,
    },
  })

  // 9) Staff contoh
  const staffHash = await bcrypt.hash('Staff123!', 10)
  await prisma.employee.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      name: 'Staff One',
      email: 'staff@example.com',
      passwordHash: staffHash,
      serviceName: 'staff1',
      companyId: hq.id,
      departmentId: depIT.id,
      positionId: posStaff.id,
      roleId: roleStaff.id,
    },
  })

  console.log('Seed done. Admin user:', { email: admin.email, pass: 'Admin123!' })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
