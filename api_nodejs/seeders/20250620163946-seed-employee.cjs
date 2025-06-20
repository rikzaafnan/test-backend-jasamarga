'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO employee 
        (nik, name, is_active, start_date, end_date)
      VALUES 
        ('11012', 'Budi', true, '2022-12-12', '2029-12-12'),
        ('11013', 'Jarot', true, '2020-05-10', '2028-09-01');
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DELETE FROM employee WHERE nik IN ('11012', '11013');
    `);
  }
};