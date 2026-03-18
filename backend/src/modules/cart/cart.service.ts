import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: { select: { stock: true, reservedStock: true } },
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  inventory: { select: { stock: true, reservedStock: true } },
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
      });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return { ...cart, totalAmount, itemCount: cart.items.length };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    // Verify product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Check stock
    if (product.inventory) {
      const available = product.inventory.stock - product.inventory.reservedStock;
      if (available < (dto.quantity || 1)) {
        throw new BadRequestException('Insufficient stock');
      }
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // Upsert cart item
    const cartItem = await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId: dto.productId },
      },
      update: { quantity: { increment: dto.quantity || 1 } },
      create: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity || 1,
      },
      include: { product: true },
    });

    return cartItem;
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: { include: { inventory: true } } },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    // Check stock
    if (cartItem.product.inventory) {
      const available =
        cartItem.product.inventory.stock - cartItem.product.inventory.reservedStock;
      if (available < dto.quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { message: 'Cart is already empty' };

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { message: 'Cart cleared' };
  }
}

