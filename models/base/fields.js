
module.exports = function(sequelize, DataTypes) {
  return {
    createdBy: {
      field: 'created_by',
      type: DataTypes.INTEGER(11)
    },
    updatedBy: {
      field: 'updated_by',
      type: DataTypes.INTEGER(11)
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE
    }
  }
}
