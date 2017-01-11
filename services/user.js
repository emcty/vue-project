
const models = require('../models');

exports.getUserById = function* (uid) {
  return yield models.user.findAll({
    include: [{
      model: models.role,
      include: [models.category]
    }],
    where: {
      id: uid
    }
  });
}

exports.createUser = function* (params) {
  return yield models.user.create({
    name: params.name,
    email: params.email,
    phone: params.phone,
    status: 1
  });
}
