'use strict';

const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  let Role = sequelize.define('role', Object.assign(baseFields(sequelize, DataTypes), {
    id: {
      field: 'role_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      field: 'role_name',
      type: DataTypes.STRING(100)
    },
    desc: {
      field: 'role_desc',
      type: DataTypes.STRING(500)
    }
  }), {
    tableName: 'role',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        Role.belongsToMany(models.category, {
          through: models.roleCategory,
          otherKey: 'module_id'
        });
      }
    }
  });

  return Role;
}
