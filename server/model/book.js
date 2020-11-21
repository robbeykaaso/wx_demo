module.exports = function (sequelize, DataTypes) {
    return sequelize.define('book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        configId: {
            type: DataTypes.STRING(255)
        },
        count: {
            type: DataTypes.INTEGER
        },
        dataId: {
          type: DataTypes.STRING(255)
        },
        endTime: {
          type: DataTypes.DATE
        }
    },{
      freezeTableName: true,
      timestamps: true
    })
  }