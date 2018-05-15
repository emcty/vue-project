module.exports = function(router) {
  router.post('/wap/pay/recharge.json', (req, res) => {
    res.json({
      control: {
        serverTime: 1526286939667,
        error: 0,
        message: "操作成功"
      },
      data: {
        bankSimpleName: "建设银行",
        bankCard: "3317",
        singleLimit: "5",
        dayLimit: "20",
        minAmount: "1000"
      }
    });
  });
}