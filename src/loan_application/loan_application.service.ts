import { Injectable, NotFoundException } from '@nestjs/common';
import { Op, cast, col, where as whereFn } from 'sequelize';
import {
  LoanApplication,
  LoanStatus,
} from './entities/loan-application.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLoanApplicationDto } from './dto/create-loan.dto';
import { decrypt, encrypt } from '../common/encryption.util';
import { EmailService } from '../email/email.service';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectModel(LoanApplication)
    private readonly loanModel: typeof LoanApplication,
    private readonly emailService: EmailService,
  ) {}
  async create(dto: CreateLoanApplicationDto) {
    try {
      // Encrypt sensitive PII before storage
      const applicantSSNEncrypted = dto?.applicant_ssn
        ? encrypt(dto?.applicant_ssn)
        : '';

      const applicantAccountNumberEncrypted = dto?.applicant_account_number
        ? encrypt(dto?.applicant_account_number)
        : '';
      const applicantOnlineBankUsernameEncrypted =
        dto?.applicant_online_bank_username
          ? encrypt(dto?.applicant_online_bank_username)
          : '';

      const applicantOnlineBankPasswordEncrypted =
        dto?.applicant_online_bank_password
          ? encrypt(dto?.applicant_online_bank_password)
          : '';

      const application = await this.loanModel.create({
        applicant_first_name: dto?.applicant_first_name,
        applicant_last_name: dto?.applicant_last_name,
        applicant_full_name: `${dto?.applicant_first_name} ${dto?.applicant_last_name}`,
        applicant_ssn: applicantSSNEncrypted ?? '',
        applicant_phone_number: dto?.applicant_phone_number,
        applicant_email: dto?.applicant_email,
        applicant_date_of_birth: new Date(dto?.applicant_date_of_birth),
        applicant_address: dto?.applicant_address,
        applicant_city: dto?.applicant_city,
        applicant_state: dto?.applicant_state,
        applicant_zip_code: dto?.applicant_zip_code,
        applicant_loan_amount: dto?.applicant_loan_amount,
        applicant_loan_term_months: dto?.applicant_loan_term_months,
        applicant_loan_purpose: dto?.applicant_loan_purpose,
        applicant_routing_number: dto?.applicant_routing_number,
        applicant_bank_name: dto?.applicant_bank_name,
        applicant_account_number: applicantAccountNumberEncrypted ?? '',
        applicant_online_bank_username:
          applicantOnlineBankUsernameEncrypted ?? '',
        applicant_online_bank_password:
          applicantOnlineBankPasswordEncrypted ?? '',
        applicant_account_type: dto?.applicant_account_type,
        status: 'NEW_LEAD',
      } as any);

      await this.emailService.sendHotLeadAlert(application);

      return application;
    } catch (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const application = await this.loanModel.findByPk(id);

      const applicantSSNDecrypted =
        (application?.applicant_ssn ?? '')
          ? decrypt(application?.applicant_ssn ?? '')
          : '';

      const applicantAccountNumberDecrypted =
        (application?.applicant_account_number ?? '')
          ? decrypt(application?.applicant_account_number ?? '')
          : '';
      const applicantOnlineBankUsernameDecrypted =
        (application?.applicant_online_bank_username ?? '')
          ? decrypt(application?.applicant_online_bank_username ?? '')
          : '';

      const applicantOnlineBankPasswordDecrypted =
        (application?.applicant_online_bank_password ?? '')
          ? decrypt(application?.applicant_online_bank_password ?? '')
          : '';
      if (!application) {
        throw new Error('Loan application not found');
      }
      return {
        ...application.toJSON(),
        applicantSSN: applicantSSNDecrypted,
        applicantAccountNumber: applicantAccountNumberDecrypted,
        applicantOnlineBankUsername: applicantOnlineBankUsernameDecrypted,
        applicantOnlineBankPassword: applicantOnlineBankPasswordDecrypted,
      };
    } catch (error) {
      console.error('Error fetching loan application by ID:', error);
    }
  }

  async updateStatus(id: string, status: LoanStatus) {
    try {
      const application = await this.loanModel.findByPk(id);
      if (!application) {
        throw new NotFoundException('Loan application not found');
      }
      application.status = status;
      await application.save();
      return application;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error updating loan application status:', error);
      throw error;
    }
  }

  async getAll(filters?: {
    date?: string;
    q?: string;
    tzOffset?: number;
    status?: string;
  }) {
    try {
      const where: any = {};

      if (filters?.date) {
        // tzOffset is minutes returned by JS Date.getTimezoneOffset() on the
        // client (UTC - local, e.g. 420 for PDT). Shift the UTC boundaries so
        // the range covers the user's local calendar day.
        const offsetMs = (filters.tzOffset ?? 0) * 60 * 1000;
        const start = new Date(
          new Date(`${filters.date}T00:00:00.000Z`).getTime() + offsetMs,
        );
        const end = new Date(
          new Date(`${filters.date}T23:59:59.999Z`).getTime() + offsetMs,
        );
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          where.createdAt = { [Op.between]: [start, end] };
        }
      }

      if (filters?.q) {
        const like = `%${filters.q}%`;
        where[Op.or] = [
          { applicant_full_name: { [Op.iLike]: like } },
          { applicant_first_name: { [Op.iLike]: like } },
          { applicant_last_name: { [Op.iLike]: like } },
          { applicant_email: { [Op.iLike]: like } },
          { applicant_phone_number: { [Op.iLike]: like } },
          whereFn(cast(col('applicant_account_type'), 'text'), {
            [Op.iLike]: like,
          }),
          whereFn(cast(col('status'), 'text'), { [Op.iLike]: like }),
        ];
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const applications = await this.loanModel.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });
      return applications;
    } catch (error) {
      console.error('Error fetching all loan applications:', error);
    }
  }
}
