import { Column, DataType, Model, Table } from 'sequelize-typescript';

export const LoanStatus = [
  'NEW_LEAD',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'FUNDED',
] as const;

const BankType = ['checking', 'savings'] as const;

export type BankType = 'checking' | 'savings';

export type LoanStatus = (typeof LoanStatus)[number];

@Table({ tableName: 'loan_applications', timestamps: true })
export class LoanApplication extends Model<LoanApplication> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_ssn: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_phone_number: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare applicant_date_of_birth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_zip_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_loan_amount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_loan_term_months: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_loan_purpose: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_routing_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_bank_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_account_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_online_bank_username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare applicant_online_bank_password: string;

  @Column({
    type: DataType.ENUM(...LoanStatus),
    allowNull: false,
  })
  declare status: LoanStatus;

  @Column({
    type: DataType.ENUM(...BankType),
    allowNull: false,
  })
  declare applicant_account_type: BankType;
}
