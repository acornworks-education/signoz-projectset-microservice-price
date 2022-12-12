const express = require('express');
const router = express.Router();
const { HistoricalDataProcessor } = require('../processors/historical-data-processor');

const processor = new HistoricalDataProcessor();

router.get('/spot/:symbol', async function(req, res) {
    res.send(await processor.getSpotPrice(req.params.symbol));
});

router.get('/historical/:symbol', async function(req, res) {
    res.send(await processor.getHisoricalPrice(req.params.symbol));
});
  
module.exports = router;
