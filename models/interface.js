'use strict';

const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('interface', Object.assign(baseFields(sequelize, DataTypes), {
    id: {
      field: 'interface_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      field: 'interface_name',
      type: DataTypes.STRING(100),
      allowNull: false
    },
    url: {
      field: 'interface_url',
      type: DataTypes.STRING(200),
      allowNull: false
    },
    accessType: {
      field: 'access_type',
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    methodType: {
      field: 'method_type',
      type: DataTypes.INTEGER(20),
      allowNull: false
    },
    headers: {
      type: DataTypes.TEXT
    },
    pathParams: {
      field: 'path_params',
      type: DataTypes.TEXT
    },
    queryParams: {
      field: 'query_params',
      type: DataTypes.TEXT
    },
    output: {
      type: DataTypes.TEXT
    },
    description: {
      field: 'interface_desc',
      type: DataTypes.STRING(500)
    }
  }), {
    tableName: 'interface',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {}
    }
  });
}
