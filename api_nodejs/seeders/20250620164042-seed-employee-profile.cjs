'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO employee_profile
        (employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'Jakarta', '1997-05-02', 'Laki-Laki', true, NULL, 'admin', 'admin', '2022-12-12','2022-12-12'),
        (2, 'Sukabumi', '1997-05-02', 'Laki-Laki', false, NULL, 'admin', 'admin', '2022-12-12', '2022-12-12');
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DELETE FROM employee_profile WHERE employee_id IN (1, 2);
    `);
  }
};
