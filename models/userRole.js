
const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userRole', Object.assign(baseFields(sequelize, DataTypes), {
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }), {
    tableName: 'user_role',
    timestamps: true,
    paranoid: true
  });
}
