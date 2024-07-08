module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  return User;
};
