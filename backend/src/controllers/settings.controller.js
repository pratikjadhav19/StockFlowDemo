const prisma = require('../config/db');

exports.getSettings = async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.orgId },
      select: { id: true, name: true, lowStockThreshold: true },
    });
    res.json(org);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { lowStockThreshold, name } = req.body;
    const org = await prisma.organization.update({
      where: { id: req.user.orgId },
      data: {
        ...(name !== undefined && { name }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: Number(lowStockThreshold) }),
      },
    });
    res.json(org);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
