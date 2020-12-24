import { Router } from 'express';
import { SoldierModel } from '../models/SoldierModel.js';
import LogManager from '../LogManager.js';

var router = Router();

router.post('/add', async function (req, res) {
  const soldier = req.body;
  console.log(req.body);

  try {
    const soldierCollection = await SoldierModel
              .create({
                soldierId: soldier.soldierId,
                arrivalTime: '0',
                wasVaccinated: false,
                wasArrived: false,
                isAbleToVaccinate: false,
                q1: false,
                q2: false,
                q3: false,
                q4: false
              });
      res.status(201).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.put('/:soldierId/vaccination_ability',async function (req, res) {
  const soldierId = req.params.soldierId;
  const able = req.body.isAbleToVaccinate;

  try {
    const soldierCollection = await SoldierModel.find({
        soldierId : soldierId
    });

    if(soldierCollection){

        const updateSoldier = await SoldierModel.update({
            isAbleToVaccinate : able
        });

        res.status(201).send(updateSoldier)

    } else {
        res.status(404).send("Soldier Not Found");
    }
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.put('/:soldierId/arrival', async function (req, res) {
  const soldierId = req.params.soldierId;
  const arrivalTime = req.body.arrivalTime;

  try {
    const soldierCollection = await SoldierModel.find({
        soldierId : soldierId
    });

    if(soldierCollection){
        const updateSoldier = await SoldierModel.update({
            arrivalTime : arrivalTime
        });

        res.status(201).send(updateSoldier)
    } else {
        res.status(404).send("Soldier Not Found");
    }
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.put('/:soldierId/was_vaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  const wasVaccinated = req.body.wasVaccinated;

  try {
    const soldierCollection = await SoldierModel.find({
        soldierId : soldierId
    });

    if(soldierCollection){
        const updateSoldier = await SoldierModel.update({
          wasVaccinated : wasVaccinated
        });

        res.status(201).send(updateSoldier)
    } else {
        res.status(404).send("Soldier Not Found");
    }
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.put('/:soldierId/answer_questions', async function (req, res) {
  const soldierId = req.params.soldierId;
  const q1 = req.body.q1;
  const q2 = req.body.q2;
  const q3 = req.body.q3;
  const q4 = req.body.q4;

  try {
    const soldierCollection = await SoldierModel.find({
        soldierId : soldierId
    });

    if(soldierCollection){
        const updateSoldier = await SoldierModel.update({
          q1 : q1,
          q2 : q2,
          q3 : q3,
          q4 : q4
        });

        res.status(201).send(updateSoldier)
    } else {
        res.status(404).send("Soldier Not Found");
    }
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

export default router;