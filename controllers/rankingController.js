const User = require('../models').User;
const League = require('../models').League;
const Portfolio = require('../models').Portfolio;

/**
 * Loops through and updates the league ranking each week based on each user's portfolio value.
 * @param {portfolio of each user in a specific league} portfolios 
 */
var updateLeague = function updateLeague(portfolios) {
  let ranking = 1;
  //console.log(portfolios)
  portfolios.forEach((portfolio) => {
      portfolio['ranking'] = ranking;
      portfolio.save();

      ranking++;
  })
}

/**
 * Finds the number of weeks between two dates
 * @param {Start date} date1
 * @param {End date} date2
 */
function diffWeeks(date1, date2) {
  var diff = (date2.getTime() - date1.getTime())/1000;

  diff /= (60 * 60 * 24 * 7);

  return Math.abs(Math.round(diff));
}

//function grabLeagueData(league) {
//  console.log("First step");
//  console.log(portfolios);
//  console.log(league);
//  const startDate = new Date(league['startDate']);
//  const endDate = new Date(league['endDate']);
//  const startingFunds = league['investmentFunds'];
//  const numberOfUsers = portfolios.length;
//  const numberOfWeeks = diffWeeks(startDate, endDate);
//
//  console.log(startingFunds);
//  console.log(numberOfUsers);
//  console.log(startDate);
//  console.log(endDate);
//  console.log(numberOfWeeks);
//  console.log(" ");
//
//}

//function updateUserPoints(user) {
  //$.when(user).then((givenUser) => {
  //  console.log(givenUser);
  //})

  
//}

/**
 * Loops through each user in the league and recalculates their global points once their league is over.
 * @param {portfolio of each user in a specific league} portfolios 
 * @param {league that is ending} league 
 */
async function updateGlobal(portfolios, league) {
  
  console.log("First step");
  console.log(portfolios);
  console.log(league);
  const startDate = new Date(league['startDate']);
  const endDate = new Date(league['endDate']);
  const startingFunds = league['investmentFunds'];
  const numberOfUsers = portfolios.length;
  const numberOfWeeks = diffWeeks(startDate, endDate);

  console.log(startingFunds);
  console.log(numberOfUsers);
  console.log(startDate);
  console.log(endDate);
  console.log(numberOfWeeks);
  console.log(" ");
  

  for (let i = 0; i < numberOfUsers; i++) {
  //portfolios.forEach((portfolio) => {
    let portfolio = portfolios[i];
    //console.log(portfolio)
    console.log(" ");

    let pointsAdded = ((((portfolio['value'] + portfolio['buyingPower']) - startingFunds)/startingFunds) * numberOfUsers) - numberOfWeeks;
    console.log(pointsAdded);
    let userID = portfolio["userID"];
    console.log(userID);
    let user = await User.findOne({where: {id: userID}});

    // The amount of points the user has before the update
    let currentUserPoints = user['points'];
    console.log(user);

    // The amount of points the user has after the update
    let totalPoints = currentUserPoints + pointsAdded;
    //console.log(totalPoints);
    user['points'] = totalPoints;

    user.save();
  }
}

module.exports = {
  leagueRankings(req, res) {
    const leagueId = req.params.leagueID;
    return Portfolio
      .findAll({where: {
        leagueID: leagueId},
        attributes: ['userID', 'value', 'ranking'],
        order: [
          ['ranking', 'ASC']
        ]})
      .then(ranking => res.status(200).send(ranking))
      .catch(error => res.status(400).send(error));
  },
  globalRankings(req, res) {
    return User
      .findAll({
        attributes: ['id', 'points'],
        order: [
          ['points', 'DESC']
        ]
      })
      .then((users) => 
      res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },
  updateLeagueRankings(req, res) {
    Portfolio
         .findAll({where: {
            leagueID: req.params.leagueID},
            order: [
              ['value', 'DESC']
            ]
         })
         .then((portfolios) =>
           updateLeague(portfolios),
           res.status(200).send("League Rankings Updated")
         )
         .catch((error) => res.status(400).send(error))
  },
  async updateGlobalRankings(req, res) {
    Portfolio
        .findAll({where: {
          leagueID: req.params.leagueID
        }})
          .then((portfolios) =>
            League.findOne({where: {
              id: req.params.leagueID
            }})
              .then((league) =>
                updateGlobal(portfolios, league),
                res.status(200).send("Global Rankings Updated")
      )
    )

    //console.log(portfolios);

    //const league = await League.findOne({where: {
    //  id: req.params.leagueID
    //}});

    //updateGlobal(portfolios, league);
    //
    //res.status(200).send("Update Global Rankings");
    //return Portfolio
    //     .findAll({where: {
    //       leagueID: req.params.leagueID},
    //      })
    //     .then((portfolios) =>
    //        
    //       updateGlobal(portfolios),
    //       res.status(200).send(portfolios)
    //     )
    //     .catch((error) => res.status(400).send(error))
  }
}