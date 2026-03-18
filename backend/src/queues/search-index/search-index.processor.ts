import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SearchIndexService } from '../../modules/search-index/search-index.service';

@Processor('search-index-update')
export class SearchIndexProcessor extends WorkerHost {
  private readonly logger = new Logger(SearchIndexProcessor.name);

  constructor(private readonly searchIndexService: SearchIndexService) {
    super();
  }

  async process(job: Job<{ productId?: string; action: string }>) {
    this.logger.log(`Processing search index job: ${job.name}`);

    try {
      switch (job.name) {
        case 'reindex-product':
          if (job.data.productId) {
            await this.searchIndexService.reindexProduct(job.data.productId);
          }
          break;
        case 'remove-product':
          if (job.data.productId) {
            await this.searchIndexService.removeFromIndex(job.data.productId);
          }
          break;
        case 'reindex-all':
          await this.searchIndexService.reindexAll();
          break;
        default:
          this.logger.warn(`Unknown search index job: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(`Search index update failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}

