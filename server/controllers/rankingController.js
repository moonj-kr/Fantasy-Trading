const User = require('../models').User;
const League = require('../models').League;
const Portfolio = require('../models').Portfolio;

/**
 * Loops through and updates the league ranking each week based on each user's portfolio value.
 * @param {portfolio of each user in a specific league} portfolios
 */
var updateLeague = function updateLeague(portfolios) {
  let ranking = 1;
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

/**
 * Loops through each user in the league and recalculates their global points once their league is over.
 * @param {portfolio of each user in a specific league} portfolios
 * @param {league that is ending} league
 */
async function updateGlobal(portfolios, league) {

  const startDate = new Date(league['startDate']);
  const endDate = new Date(league['endDate']);
  const startingFunds = league['investmentFunds'];
  const numberOfUsers = portfolios.length;
  const numberOfWeeks = diffWeeks(startDate, endDate);

  for (let i = 0; i < numberOfUsers; i++) {
    let portfolio = portfolios[i];

    let pointsAdded = ((((portfolio['value'] + portfolio['buyingPower']) - startingFunds)/startingFunds) * numberOfUsers) - numberOfWeeks;
    let userID = portfolio.userID;
    let user = await User.findOne({where: {id: userID}});

    // The amount of points the user has before the update
    let currentUserPoints = user.points;

    // The amount of points the user has after the update
    let totalPoints = currentUserPoints + pointsAdded;

    user.points = Math.round(totalPoints);
    user.changeInPoints = Math.round(pointsAdded);
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
        attributes: ['username', 'points', 'changeInPoints'],
        order: [
          ['points', 'DESC']
        ]
      })
      .then((users) =>
      res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },
  getCurrentGlobalRanking(req, res){
    return User.findOne({where: {sessionID: req.sessionID}}).then((user) => {
      User.findAll({attributes: ['id', 'points'], order: [['points', 'DESC']]}).then((users) => {
        for(let index=0; index<users.length; index++){
          let rank = index+1;
          if(users[index].id == user.id){
            res.status(200).send({rank: rank});
          }
        }
      }).catch((error) => {console.log(error)})
    }).catch((error) => {res.status(400).send(error)})
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
              .catch((error) => res.status(400).send(error))
          )
  }
}
