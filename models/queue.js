'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    static associate(models) {
      Queue.hasOne(models.QueueLog, {
        foreignKey: 'queue_id',
        as: 'log'
      });
    }
  }

  Queue.init({
    queue_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('WALK-IN', 'RESERVATION'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('WAITING', 'CALLED', 'DONE'),
      allowNull: false,
      defaultValue: 'WAITING'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Queue',
    tableName: 'queues',
    freezeTableName: true,
    timestamps: false
  });

  return Queue;
};