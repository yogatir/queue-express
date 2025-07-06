'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPin = await bcrypt.hash('11111', 10);
    await queryInterface.bulkInsert('staffs', [
      { name: 'Yoga Tirta', email: 'yogatirta@gmail.com', pin: hashedPin, is_active: false, created_at: new Date() },
      { name: 'Bambang Santoso', email: 'bambangsantoso@gmail.com', pin: hashedPin, is_active: false, created_at: new Date() },
      { name: 'Dina Pertiwi', email: 'dinapertiwi@gmail.com', pin: hashedPin, is_active: false, created_at: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('staffs', null, {});
  }
};