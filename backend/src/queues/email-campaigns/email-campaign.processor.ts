import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignStatus } from '@prisma/client';

@Processor('email-campaigns')
export class EmailCampaignProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailCampaignProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing email campaign job: ${job.name}`);

    try {
      switch (job.name) {
        case 'send-campaign':
          await this.sendCampaign(job.data);
          break;
        case 'send-triggered-campaign':
          await this.sendTriggeredCampaign(job.data);
          break;
        default:
          this.logger.warn(`Unknown campaign job: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(`Email campaign job failed: ${error.message}`, error.stack);

      // Mark campaign as failed
      if (job.data.campaignId) {
        await this.prisma.emailCampaign.update({
          where: { id: job.data.campaignId },
          data: { status: CampaignStatus.FAILED },
        });
      }
      throw error;
    }
  }

  private async sendCampaign(data: { campaignId: string; subject: string; htmlContent: string }) {
    const campaign = await this.prisma.emailCampaign.findUnique({
      where: { id: data.campaignId },
    });
    if (!campaign) return;

    // Fetch all active users as recipients
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, email: true, firstName: true },
    });

    let sentCount = 0;
    for (const user of users) {
      // Stub: integrate with SendGrid/SES/Nodemailer
      this.logger.log(`📧 Sending campaign "${campaign.name}" to ${user.email}`);
      sentCount++;
    }

    await this.prisma.emailCampaign.update({
      where: { id: data.campaignId },
      data: {
        status: CampaignStatus.SENT,
        sentAt: new Date(),
        sentCount,
      },
    });

    this.logger.log(`Campaign "${campaign.name}" sent to ${sentCount} recipients`);
  }

  private async sendTriggeredCampaign(data: { campaignId: string; triggerData: Record<string, any> }) {
    const campaign = await this.prisma.emailCampaign.findUnique({
      where: { id: data.campaignId },
    });
    if (!campaign) return;

    this.logger.log(
      `📧 Triggered campaign "${campaign.name}" for event data: ${JSON.stringify(data.triggerData)}`,
    );

    await this.prisma.emailCampaign.update({
      where: { id: data.campaignId },
      data: { sentCount: { increment: 1 } },
    });
  }
}

