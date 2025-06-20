'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_family', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // bisa ditambah FK ke employee(id)
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      identifier: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      job: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      place_of_birth: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true
      },
      religion: {
        type: Sequelize.ENUM(
          'Islam', 'Katolik', 'Budha', 'Protestan', 'Konghucu'
        ),
        allowNull: true
      },
      is_life: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_divorced: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      relation_status: {
        type: Sequelize.ENUM(
          'Suami', 'Istri', 'Anak', 'Anak Sambung'
        ),
        allowNull: true
      },
      created_by: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      updated_by: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employee_family');
  }
};
