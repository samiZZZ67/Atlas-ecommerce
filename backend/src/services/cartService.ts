import prisma from '../config/prisma';

export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
  });
  return items;
};

export const addOrUpdateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existing.quantity + quantity },
    });
  }
  return prisma.cartItem.create({ data: { userId, productId, quantity } });
};

export const updateCartItemQty = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
    return null;
  }
  return prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  });
};

export const removeCartItem = async (userId: string, productId: string) => {
  await prisma.cartItem.deleteMany({ where: { userId, productId } });
};

export const clearCart = async (userId: string) => {
  await prisma.cartItem.deleteMany({ where: { userId } });
};
