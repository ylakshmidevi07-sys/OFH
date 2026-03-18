import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findByProduct(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async create(userId: string, dto: CreateReviewDto) {
    // Check product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Check for duplicate
    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId: dto.productId, userId } },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    // Check if user purchased this product (verified review)
    const purchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: { userId, status: 'DELIVERED' },
      },
    });

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId,
        rating: dto.rating,
        comment: dto.comment,
        verified: !!purchased,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Invalidate product cache
    await this.redis.invalidatePattern(`products:${product.slug}`);

    return review;
  }

  async update(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });
  }

  async delete(reviewId: string, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Not authorized to delete this review');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted' };
  }
}

