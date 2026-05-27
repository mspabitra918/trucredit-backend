import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message) private readonly model: typeof Message,
    private readonly mail: EmailService,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    try {
      const message = await this.model.create({
        full_name: dto.full_name,
        email: dto.email,
        number: dto.number ?? null,
        subject: dto.subject,
        message: dto.message,
        crmSynced: false,
      } as Partial<Message> as Message);

      //   try {
      //     const salesInbox = process.env.SALES_INBOX || 'sales@trucredit.com';
      //     await Promise.all([
      //       this.mail.sendLeadConfirmation(lead.email, lead.full_name),
      //       this.mail.sendLeadAlert(
      //         salesInbox,
      //         lead.full_name,
      //         lead.inquiry_type,
      //         lead.id,
      //       ),
      //     ]);
      //   } catch (mailErr) {
      //     this.logger.warn(
      //       `Lead saved but email failed: ${(mailErr as Error).message}`,
      //     );
      //   }

      return message;
    } catch (err) {
      this.logger.error('Failed to create message', err as Error);
      throw new InternalServerErrorException(
        'Could not submit your inquiry. Please try again.',
      );
    }
  }

  async findAll(filters: { inquiryType?: string; date?: string }) {
    try {
      const where: Record<string, unknown> = {};
      if (filters.inquiryType) where.inquiryType = filters.inquiryType;

      if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);

        where.created_at = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      return await this.model.findAll({
        where,
        order: [['created_at', 'DESC']],
      });
    } catch (err) {
      this.logger.error('Failed to list messages', err as Error);
      throw new InternalServerErrorException('Could not load messages.');
    }
  }

  async findOne(id: string): Promise<Message> {
    try {
      const message = await this.model.findByPk(id);
      if (!message) throw new NotFoundException('Message not found.');
      return message;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Failed to fetch message', err as Error);
      throw new InternalServerErrorException('Could not load message.');
    }
  }
}
