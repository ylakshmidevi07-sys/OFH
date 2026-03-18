/**
 * Media abstraction layer — provides a consistent interface for resolving
 * product image URLs. Currently serves images from the local /images path,
 * but can be swapped to an object storage provider (S3, GCS, Cloudflare R2)
 * by changing the implementation here without touching the frontend.
 *
 * Usage in services:
 *   const url = this.media.resolveUrl('product-image.jpg');
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MediaProvider {
  resolveUrl(path: string): string;
  // Future: upload(file: Buffer, key: string): Promise<string>;
  // Future: delete(key: string): Promise<void>;
}

@Injectable()
export class MediaService implements MediaProvider {
  private readonly logger = new Logger(MediaService.name);
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Read from env or default to relative path (served by Nginx or Vite dev)
    this.baseUrl = this.configService.get<string>('MEDIA_BASE_URL', '');
  }

  /**
   * Resolve a relative image path to a full URL.
   * If the path is already an absolute URL, return it as-is.
   */
  resolveUrl(path: string): string {
    if (!path) return '/placeholder.svg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${this.baseUrl}${path}`;
    return `${this.baseUrl}/${path}`;
  }

  /**
   * Resolve an array of image paths.
   */
  resolveUrls(paths: string[]): string[] {
    return (paths || []).map((p) => this.resolveUrl(p));
  }
}

