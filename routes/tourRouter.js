const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

router
  .route('/top-5-tour')
  .get(tourController.aliasTop5Tour, tourController.getAllTour);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-stat').get(tourController.getTourStats);

router
  .route('/')
  .post(tourController.createTour)
  .get(tourController.getAllTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
