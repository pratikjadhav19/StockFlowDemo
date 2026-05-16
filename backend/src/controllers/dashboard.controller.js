const prisma = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const { orgId } = req.user;
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    const threshold = org?.lowStockThreshold ?? 10;

    const [totalProducts, lowStockProducts, valueAgg] = await Promise.all([
      prisma.product.count({ where: { orgId } }),
      prisma.product.findMany({
        where: { orgId, quantity: { lte: threshold } },
        orderBy: { quantity: 'asc' },
      }),
      prisma.product.findMany({
        where: { orgId },
        select: { quantity: true, price: true },
      }),
    ]);

    const inventoryValue = valueAgg.reduce((sum, p) => sum + p.quantity * p.price, 0);

    res.json({
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      inventoryValue,
      threshold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
