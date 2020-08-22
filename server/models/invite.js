'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define('Invite', {
    invitationKey: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.ENUM(['No Account', 'Pending', 'Accepted'])
  }, {});
  Invite.associate = function(models) {

  };
  return Invite;
};
