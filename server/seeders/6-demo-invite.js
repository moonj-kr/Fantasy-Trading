module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Invites', [
      {
        invitationKey: '012345abcdef',
        email: 'google@google.com',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invitationKey: 'abcdef012345',
        email: 'example@gmail.com',
        status: 'No Account',
        createdAt: new Date(),
        updatedAt: new Date()
      },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Invites', null, {});
  }
};
