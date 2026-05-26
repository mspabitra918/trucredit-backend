'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('loan_applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      applicant_first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_ssn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_date_of_birth: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_loan_amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_loan_purpose: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_loan_term_months: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      applicant_routing_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_online_bank_username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_online_bank_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicant_account_type: {
        type: Sequelize.ENUM('checking', 'savings'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'NEW_LEAD',
          'IN_REVIEW',
          'APPROVED',
          'REJECTED',
          'FUNDED',
        ),
        allowNull: false,
        defaultValue: 'NEW_LEAD',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('loan_applications');
  },
};
