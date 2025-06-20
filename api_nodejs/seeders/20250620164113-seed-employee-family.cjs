'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO employee_family
        (employee_id, name, identifier, job, place_of_birth, date_of_birth, religion, is_life, is_divorced, relation_status, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'Marni', '1000001', 'Ibu Rumah Tangga','Denpasar', '1995-10-13', 'Islam', true, false, 'Istri', 'admin', 'admin', '2022-12-12', '2022-12-12'),
        (1, 'Dana', '1000002', 'Pelajar','Bangkalan', '2006-10-13', 'Islam', true, false, 'Anak', 'admin', 'admin', '2022-12-12','2022-12-12'),
        (1, 'Sourvenir', '1000003', 'Pelajar','Bangkalan', '2008-10-13', 'Islam', true, false, 'Anak', 'admin', 'admin', '2022-12-12', '2022-12-12');
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DELETE FROM employee_family WHERE employee_id IN (1, 2, 3);
    `);
  }
};
