import prisma from '../config/prisma';
import { clearCart } from './cartService';

interface AddressInput {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  [key: string]: unknown;
}

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { date: 'desc' },
  });
};

export const placeOrder = async (
  userId: string,
  address: AddressInput,
  paymentLast4: string
) => {
  // Fetch cart items
  const cartItems = await prisma.cartItem.findMany({ where: { userId } });
  if (cartItems.length === 0) {
    throw { statusCode: 400, message: 'Cart is empty.' };
  }

  // Fetch product data for each cart item
  const productIds = cartItems.map((ci) => ci.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const items = cartItems
    .map((ci) => {
      const p = products.find((x) => x.id === ci.productId);
      if (!p) return null;
      return {
        productId: p.id,
        name: p.name,
        qty: ci.quantity,
        price: p.price,
        image: p.images[0] || '',
      };
    })
    .filter(Boolean) as {
      productId: string;
      name: string;
      qty: number;
      price: import('@prisma/client').Prisma.Decimal;
      image: string;
    }[];

  const subtotal = items.reduce(
    (s, i) => s + parseFloat(i.price.toString()) * i.qty,
    0
  );
  const shipping = subtotal > 200 ? 0 : 18;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const order = await prisma.order.create({
    data: {
      userId,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: address as import('@prisma/client').Prisma.InputJsonValue,
      paymentLast4,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image,
        })),
      },
    },
    include: { items: true },
  });

  await clearCart(userId);
  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return prisma.order.update({ where: { id: orderId }, data: { status: status as 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' } });
};
