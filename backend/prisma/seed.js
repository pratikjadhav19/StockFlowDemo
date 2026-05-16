const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: { id: 'demo-org', name: 'Demo Company', lowStockThreshold: 10 },
  });

  const hashed = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { email: 'admin@demo.com', name: 'Admin User', password: hashed, role: 'admin', orgId: org.id },
  });

  const products = [
    { name: 'Widget A', sku: 'WGT-001', quantity: 150, price: 9.99, category: 'Widgets' },
    { name: 'Widget B', sku: 'WGT-002', quantity: 5, price: 14.99, category: 'Widgets' },
    { name: 'Gadget X', sku: 'GDG-001', quantity: 3, price: 49.99, category: 'Gadgets' },
    { name: 'Gadget Y', sku: 'GDG-002', quantity: 200, price: 29.99, category: 'Gadgets' },
    { name: 'Part Z', sku: 'PRT-001', quantity: 8, price: 4.99, category: 'Parts' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku_orgId: { sku: p.sku, orgId: org.id } },
      update: {},
      create: { ...p, orgId: org.id },
    });
  }
  console.log('Seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
