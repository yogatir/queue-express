'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('queue_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      queue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'queues',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      staff_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'staffs',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      called_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      duration_seconds: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('queue_logs');
  }
};