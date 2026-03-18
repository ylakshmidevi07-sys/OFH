import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { BannersModule } from './modules/banners/banners.module';
import { PricingRulesModule } from './modules/pricing-rules/pricing-rules.module';
import { EmailCampaignsModule } from './modules/email-campaigns/email-campaigns.module';
import { StoreSettingsModule } from './modules/store-settings/store-settings.module';
import { SearchIndexModule } from './modules/search-index/search-index.module';
import { SeederModule } from './common/seeder/seeder.module';
import { HealthModule } from './common/health/health.module';
import { MediaModule } from './common/media/media.module';
import { NotificationsModule } from './queues/notifications/notifications.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: config.get<number>('THROTTLE_TTL', 60000),
        limit: config.get<number>('THROTTLE_LIMIT', 100),
      }]),
    }),

    // Database
    PrismaModule,

    // Caching (gracefully handles missing Redis)
    RedisModule,

    // Media abstraction
    MediaModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    InventoryModule,
    ReviewsModule,
    AdminModule,
    AnalyticsModule,

    // Enterprise modules
    HomepageModule,
    BannersModule,
    PricingRulesModule,
    EmailCampaignsModule,
    StoreSettingsModule,
    SearchIndexModule,


    // Auto-seed default admin on startup
    SeederModule,

    // Health check / Metrics
    HealthModule,

    // Queue workers (order processing, emails)
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

