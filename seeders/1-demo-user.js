module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'RoshTheCoolCat',
        password: '2Kool4Skool',
        firstName: 'Roshni',
        lastName: 'Barodia',
        email: 'rxb9639@g.rit.edu',
        sessionID: '12345abcde',
        points: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'LuisTheMonster',
        password: 'monster4lyfe',
        firstName: 'Luis',
        lastName: 'Gutierrez',
        email: 'lxg8800@g.rit.edu',
        sessionID: '1a2b3c4d5e',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'ChrisTheFrontEndGod',
        password: 'javascript5ever',
        firstName: 'Christopher',
        lastName: 'Savan',
        email: 'cxs7700@g.rit.edu',
        sessionID: 'abcde12345',
        points: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'JisookTheGenius',
        password: 'alberteinstein',
        firstName: 'Jisook',
        lastName: 'Moon',
        email: 'jxm6162@rit.edu',
        sessionID: 'e5d4c3b2a1',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'RyanThePurpleDorito',
        password: 'sweetchili',
        firstName: 'Ryan',
        lastName: 'Vasquez',
        email: 'rxv3774@g.rit.edu',
        sessionID: '12345fghij',
        points: 700,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
