import { IsString, IsNotEmpty, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  LoanStatus,
  LoanStatus as LoanStatusType,
} from '../entities/loan-application.entity';

export class CreateLoanApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_first_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_last_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_full_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_ssn!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_phone_number!: string;

  @ApiProperty({ example: '05/20/1995' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: 'Date must be in MM/DD/YYYY format',
  })
  applicant_date_of_birth!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_address!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_state!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_zip_code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_loan_amount!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_loan_term_months!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_loan_purpose!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_routing_number!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_bank_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_account_number!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_online_bank_username!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicant_online_bank_password!: string;

  @ApiProperty()
  @IsString()
  applicant_account_type?: string;

  @ApiProperty({ enum: LoanStatus })
  @IsEnum(LoanStatus)
  status!: LoanStatusType;
}
