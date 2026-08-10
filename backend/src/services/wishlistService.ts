import prisma from '../config/prisma';

export const getWishlist = async (userId: string) => {
  const items = await prisma.wishlistItem.findMany({ where: { userId } });
  return items.map((i) => i.productId);
};

export const toggleWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { added: false };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  return { added: true };
};
