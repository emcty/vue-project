'use strict';

const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', Object.assign(baseFields(sequelize, DataTypes), {
    id: {
      field: 'user_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      field: 'user_name',
      type: DataTypes.STRING(50)
    },
    email: {
      field: 'user_email',
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      field: 'user_phone',
      type: DataTypes.STRING(20)
    },
    status: {
      field: 'user_status',
      type: DataTypes.INTEGER(4)
    }
  }), {
    tableName: 'user',
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.role, {
          through: models.userRole
        });
      }
    }
  });

  return User;
}
