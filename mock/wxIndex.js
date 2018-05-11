'use strict';

module.exports = function(router) {
  router.post('/api/user/abc.json', (req, res) => {
    res.json({
      status: 0,
      data: {
        name: 'dl',
        id: req.params.id
      }
    });
  });

  router.get('/api/date', (req, res) => {
    res.json({
      status: 0,
      data: new Date()
    });
  });
}
