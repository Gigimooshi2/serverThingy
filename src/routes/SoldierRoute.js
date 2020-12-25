import { Router } from 'express';
import { SoldierModel } from '../models/SoldierModel.js';
import LogManager from '../LogManager.js';
import { CPRCountDownModel } from '../models/CPRCountDownModel.js';

var router = Router();

router.post('/addSoliderToArrivalQueue', async function (req, res) {
  const soldier = req.body;
  console.log(req.body);
  try {
    const soldierCollection = await SoldierModel
      .create({
        soldierId: soldier.soldierId,
        arrivalTime: soldier.arrivalTime,
        wasVaccinated: false,
        wasArrived: false,
        isAbleToVaccinate: false,
        q1: soldier.q1,
        q2: soldier.q2,
        q3: soldier.q3
      });
    res.status(201).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});
router.get('/getResultGetTopSoldiers', async function (req, res) {
  try {
    const soldierCollection = await SoldierModel.findAll({
      attributes: ['soldierId'],
      limit: 50
    })
    res.status(201).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});
router.get('/getResultGetTopSoldiers', async function (req, res) {
  try {
    const soldierCollection = await SoldierModel.findAll({
      attributes: ['soldierId'],
      limit: 50
    })
    res.status(201).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/vaccination_ability', async function (req, res) {
  const soldierId = req.params.soldierId;
  const able = req.body.isAbleToVaccinate;

  try {
    const soldierCollection = await SoldierModel.find({
      soldierId: soldierId
    });

    if (soldierCollection) {

      const updateSoldier = await SoldierModel.update({
        isAbleToVaccinate: able
      });

      res.status(201).send(updateSoldier)

    } else {
      res.status(404).send("Soldier Not Found");
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/arrival', async function (req, res) {
  const soldierId = req.params.soldierId;
  const arrivalTime = req.body.arrivalTime;

  try {
    const soldierCollection = await SoldierModel.find({
      soldierId: soldierId
    });

    if (soldierCollection) {
      const updateSoldier = await SoldierModel.update({
        arrivalTime: arrivalTime
      });

      res.status(201).send(updateSoldier)
    } else {
      res.status(404).send("Soldier Not Found");
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/was_vaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  const wasVaccinated = req.body.wasVaccinated;

  try {
    const soldierCollection = await SoldierModel.find({
      soldierId: soldierId
    });

    if (soldierCollection) {
      const updateSoldier = await SoldierModel.update({
        wasVaccinated: wasVaccinated
      });

      res.status(201).send(updateSoldier)
    } else {
      res.status(404).send("Soldier Not Found");
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/answer_questions', async function (req, res) {
  const soldierId = req.params.soldierId;
  const q1 = req.body.q1;
  const q2 = req.body.q2;
  const q3 = req.body.q3;

  try {
    const soldierCollection = await SoldierModel.find({
      soldierId: soldierId
    });

    if (soldierCollection) {
      const updateSoldier = await SoldierModel.update({
        q1: q1,
        q2: q2,
        q3: q3
      });

      res.status(201).send(updateSoldier)
    } else {
      res.status(404).send("Soldier Not Found");
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.post('/:soldierId/wasVaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  try {
    const countDown = await CPRCountDownModel.create({ soldierId });
    res.status(201).send(countDown)
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/getAllCountdowns', async function (req, res) {
  try {
    const soldiers = await CPRCountDownModel.findAll(
      {
        attributes: ['soldierId', 'createdAt'],
        raw: true
      }
    );
    const now = Date.now();
    const countDownTime = 15 * 1000 * 60;
    const deleteCountdownTime = countDownTime * 2;
    const allCountDowns = [];
    soldiers.forEach(soldier => {
      const timeCountDown = now - new Date(soldier.createdAt);
      if (timeCountDown > deleteCountdownTime) {
        CPRCountDownModel.destroy({
          where: {
            soldierId: soldier.soldierId
          }
        });
      } else {
        console.log({ soldierId: soldier.soldierId, countdown: timeCountDown > countDownTime ? 0 : timeCountDown });
        allCountDowns.push({ soldierId: soldier.soldierId, canGo: timeCountDown >= countDownTime });
      }
    });
    res.status(200).send(allCountDowns);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;