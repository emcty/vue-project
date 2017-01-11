
const baseFields = require('./base/fields');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roleCategory', Object.assign(baseFields(sequelize, DataTypes), {
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    module_id: {
      field: 'module_id',
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    privilege: {
      field: 'privilege_type',
      type: DataTypes.INTEGER(4),
      allowNull: false
    }
  }), {
    tableName: 'role_module',
    timestamps: true,
    paranoid: true
  });
}
