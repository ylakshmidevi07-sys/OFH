import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Seeds default admin credentials on first application startup.
 * If the admin account already exists, it is left untouched.
 *
 * Default credentials (change immediately in production):
 *   Email:    admin@ofh.com
 *   Password: admin@OFH2026
 */
@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  private async seedDefaultAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@ofh.com');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin@OFH2026');

    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      this.logger.log(`Default admin already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        isActive: true,
      },
    });

    this.logger.log(`✅ Default admin account created`);
    this.logger.log(`   Email:    ${email}`);
    this.logger.log(`   Password: ${password}`);
    this.logger.warn(`   ⚠️  Change these credentials immediately in production!`);
  }
}


