'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {
      
    }
  }
  Staff.init({
    name: DataTypes.STRING,
    pin: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staffs',
    freezeTableName: true,
    timestamps: false    
  });
  return Staff;
};