'use strict';

const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', Object.assign(baseFields(sequelize, DataTypes), {
    id: {
      field: 'module_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    type: {
      field: 'module_type',
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    name: {
      field: 'module_name',
      type: DataTypes.STRING(200),
      allowNull: false
    },
    parent: {
      field: 'parent_module_id',
      type: DataTypes.INTEGER(11)
    }
  }), {
    tableName: 'module',
    timestamps: true,
    paranoid: true
  });
};
