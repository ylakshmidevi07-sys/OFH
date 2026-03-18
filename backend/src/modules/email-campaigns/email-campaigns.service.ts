import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmailCampaignDto, UpdateEmailCampaignDto } from './dto/email-campaign.dto';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class EmailCampaignsService {
  private readonly logger = new Logger(EmailCampaignsService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('email-campaigns') private readonly campaignQueue: Queue,
  ) {}

  async findAll() {
    return this.prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const campaign = await this.prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateEmailCampaignDto) {
    const campaign = await this.prisma.emailCampaign.create({
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
    this.logger.log(`Email campaign created: ${campaign.name}`);
    return campaign;
  }

  async update(id: string, dto: UpdateEmailCampaignDto) {
    const existing = await this.prisma.emailCampaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');
    if (existing.status === CampaignStatus.SENDING || existing.status === CampaignStatus.SENT) {
      throw new BadRequestException('Cannot edit a campaign that is sending or already sent');
    }

    return this.prisma.emailCampaign.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.emailCampaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');

    await this.prisma.emailCampaign.delete({ where: { id } });
    return { message: 'Campaign deleted' };
  }

  async send(id: string) {
    const campaign = await this.prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status === CampaignStatus.SENDING || campaign.status === CampaignStatus.SENT) {
      throw new BadRequestException('Campaign already sent or in progress');
    }

    // Update status to SENDING
    await this.prisma.emailCampaign.update({
      where: { id },
      data: { status: CampaignStatus.SENDING },
    });

    // Enqueue the campaign send job
    await this.campaignQueue.add('send-campaign', {
      campaignId: id,
      subject: campaign.subject,
      htmlContent: campaign.htmlContent,
      type: campaign.type,
    });

    this.logger.log(`Campaign ${campaign.name} queued for sending`);
    return { message: 'Campaign queued for sending' };
  }

  /**
   * Handle event-triggered campaigns (called by other services).
   */
  async handleTriggerEvent(event: string, data: Record<string, any>) {
    const campaigns = await this.prisma.emailCampaign.findMany({
      where: {
        triggerEvent: event,
        isActive: true,
        status: { not: CampaignStatus.SENDING },
      },
    });

    for (const campaign of campaigns) {
      await this.campaignQueue.add('send-triggered-campaign', {
        campaignId: campaign.id,
        triggerData: data,
      });
    }

    this.logger.log(`Triggered ${campaigns.length} campaigns for event: ${event}`);
  }
}

