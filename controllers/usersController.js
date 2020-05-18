const User = require('../models').User;


module.exports = {
  create(req, res) {
    return User
      .create({
        content: req.body.content,
        userId: req.params.userId,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => res.status(400).send(error));
  },
  // login(req, res){
  //   return User
  //     .findOne({where: {username: req.body.username, password: req.body.password}})
  //     .then((user) =>
  //       user.update({sessionId: req.session.id})
  //       res.status(200).send(user);
  //     )
  //     .catch((error) => res.status(400).send(error))
  // }
};
