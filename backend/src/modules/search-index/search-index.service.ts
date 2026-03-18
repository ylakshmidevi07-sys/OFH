import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Search Index service – prepares product data for future search engine integration.
 * Currently acts as a placeholder; can be swapped for Meilisearch/Elasticsearch client.
 */
@Injectable()
export class SearchIndexService {
  private readonly logger = new Logger(SearchIndexService.name);

  constructor(private prisma: PrismaService) {}

  async reindexProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } },
      },
    });

    if (!product) {
      this.logger.warn(`Product ${productId} not found for reindexing`);
      return;
    }

    // Build a search document (future: push to Meilisearch / Elasticsearch)
    const searchDocument = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category?.name,
      price: product.price,
      tags: product.tags,
      isActive: product.isActive,
      isHidden: product.isHidden,
    };

    this.logger.log(`Search index updated for product: ${product.name}`);
    // Placeholder: In production, push searchDocument to search engine
    return searchDocument;
  }

  async reindexAll() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isHidden: false },
      include: { category: { select: { name: true } } },
    });

    this.logger.log(`Reindexing ${products.length} products`);

    // Placeholder: batch push to search engine
    for (const product of products) {
      await this.reindexProduct(product.id);
    }

    return { indexed: products.length };
  }

  async removeFromIndex(productId: string) {
    this.logger.log(`Removed product ${productId} from search index`);
    // Placeholder: remove from search engine
  }
}

