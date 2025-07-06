'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QueueLog extends Model {
    static associate(models) {
      QueueLog.belongsTo(models.Queue, {
        foreignKey: 'queue_id',
        as: 'queue'
      });
      QueueLog.belongsTo(models.Staff, {
        foreignKey: 'staff_id',
        as: 'staff'
      });
    }
  }

  QueueLog.init({
    queue_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    called_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'QueueLog',
    tableName: 'queue_logs',
    freezeTableName: true,
    timestamps: false
  });

  return QueueLog;
};