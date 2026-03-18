-- CreateEnum
CREATE TYPE "HomepageSectionType" AS ENUM ('HERO', 'FEATURED_PRODUCTS', 'BANNER', 'CATEGORIES', 'NEWSLETTER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOMEPAGE', 'CATEGORY_PAGE', 'CHECKOUT', 'SIDEBAR');

-- CreateEnum
CREATE TYPE "PricingRuleType" AS ENUM ('PERCENTAGE', 'FIXED', 'TIERED');

-- CreateEnum
CREATE TYPE "PricingTargetType" AS ENUM ('PRODUCT', 'CATEGORY', 'CART');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('PROMOTION', 'ABANDONED_CART', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "compareAtPrice" DOUBLE PRECISION,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "featured_products" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "featured_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "type" "HomepageSectionType" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'HOMEPAGE',
    "position" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PricingRuleType" NOT NULL,
    "targetType" "PricingTargetType" NOT NULL,
    "targetId" TEXT,
    "productId" TEXT,
    "categoryId" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "minQuantity" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "subject" TEXT,
    "htmlContent" TEXT,
    "templateId" TEXT,
    "triggerEvent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_settings" (
    "id" TEXT NOT NULL,
    "storeName" TEXT NOT NULL DEFAULT 'OFH - The Organic Foods House',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "shippingBaseCost" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "freeShippingMin" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
    "supportEmail" TEXT NOT NULL DEFAULT 'support@ofh.com',
    "supportPhone" TEXT,
    "themeConfig" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "featured_products_isActive_idx" ON "featured_products"("isActive");

-- CreateIndex
CREATE INDEX "featured_products_position_idx" ON "featured_products"("position");

-- CreateIndex
CREATE UNIQUE INDEX "featured_products_productId_key" ON "featured_products"("productId");

-- CreateIndex
CREATE INDEX "homepage_sections_isActive_idx" ON "homepage_sections"("isActive");

-- CreateIndex
CREATE INDEX "homepage_sections_position_idx" ON "homepage_sections"("position");

-- CreateIndex
CREATE INDEX "banners_placement_idx" ON "banners"("placement");

-- CreateIndex
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");

-- CreateIndex
CREATE INDEX "pricing_rules_targetType_idx" ON "pricing_rules"("targetType");

-- CreateIndex
CREATE INDEX "pricing_rules_isActive_idx" ON "pricing_rules"("isActive");

-- CreateIndex
CREATE INDEX "pricing_rules_priority_idx" ON "pricing_rules"("priority");

-- CreateIndex
CREATE INDEX "email_campaigns_type_idx" ON "email_campaigns"("type");

-- CreateIndex
CREATE INDEX "email_campaigns_status_idx" ON "email_campaigns"("status");

-- CreateIndex
CREATE INDEX "email_campaigns_isActive_idx" ON "email_campaigns"("isActive");

-- CreateIndex
CREATE INDEX "products_isHidden_idx" ON "products"("isHidden");

-- CreateIndex
CREATE INDEX "products_isFeatured_idx" ON "products"("isFeatured");

-- AddForeignKey
ALTER TABLE "featured_products" ADD CONSTRAINT "featured_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
