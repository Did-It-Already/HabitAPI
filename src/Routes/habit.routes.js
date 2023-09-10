const express = require('express');
const router = express.Router()
const habitServices  = require('../services/habits.services');

router.get('/', function(req, res){
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});
router.get('/habitos', habitServices.seeHabits);
router.get('/habitos/:habitid', habitServices.seeHabit);
router.post('/habitos', habitServices.createHabit);
router.put('/habitos/:habitid', habitServices.updateHabit);
router.delete('/habitos/:habitid', habitServices.deleteHabit);
router.put('/hacer/:habitid', habitServices.doHabit);
router.put('/revisar', habitServices.checkHabit);
router.get('/estadisticas', habitServices.seeStadistics);
router.get('/estadisticas/:filtro/:valor', habitServices.seeStadistic)

module.exports = router;