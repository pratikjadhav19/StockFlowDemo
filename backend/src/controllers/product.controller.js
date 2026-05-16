const prisma = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const where = {
      orgId: req.user.orgId,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category }),
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ products, total, page: Number(page), limit: Number(limit) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, quantity, price, category } = req.body;
    const product = await prisma.product.create({
      data: { name, sku, quantity: Number(quantity), price: Number(price), category, orgId: req.user.orgId },
    });
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'SKU already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, sku, quantity, price, category } = req.body;
    const result = await prisma.product.updateMany({
      where: { id: req.params.id, orgId: req.user.orgId },
      data: { name, sku, quantity: Number(quantity), price: Number(price), category },
    });
    if (result.count === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'SKU already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await prisma.product.deleteMany({
      where: { id: req.params.id, orgId: req.user.orgId },
    });
    if (result.count === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adjustStock = async (req, res) => {
  try {
    const { adjustment } = req.body;
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, orgId: req.user.orgId },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newQty = product.quantity + Number(adjustment);
    if (newQty < 0) return res.status(400).json({ message: 'Insufficient stock' });

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { quantity: newQty },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
