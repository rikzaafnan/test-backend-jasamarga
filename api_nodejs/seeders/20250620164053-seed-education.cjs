'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO education
        (employee_id, name, level, description, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'SMKN 7 JAKARTA', 'Sma', 'Sekolah Menengah Atas', 'admin', 'admin', '2022-12-12', '2022-12-12'),
        (2, 'Universitas Neegri Jakarta', 'Strata 1', 'Sarjana', 'admin', 'admin', '2022-12-12', '2022-12-12');
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DELETE FROM education WHERE employee_id IN (1, 2);
    `);
  }
};
