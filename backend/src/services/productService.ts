import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getProducts = async (query: {
  category?: string;
  search?: string;
  sort?: string;
  filter?: string;
  sale?: string;
  page?: number;
  limit?: number;
}) => {
  const { category, search, sort, filter, sale, page = 1, limit = 20 } = query;

  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;
  if (sale === 'true') where.originalPrice = { not: null };
  if (filter === 'new') where.newArrival = true;
  if (filter === 'bestseller') where.bestseller = true;
  if (filter === 'featured') where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'rating') orderBy = { rating: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) throw { statusCode: 404, message: 'Product not found.' };
  return product;
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw { statusCode: 404, message: 'Product not found.' };
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: string) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw { statusCode: 404, message: 'Product not found.' };
  return prisma.product.delete({ where: { id } });
};
