import Router from 'express';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';
import LogManager from '../LogManager.js';
import { vaidateSoldierId } from './SoldierRoute.js'
import { SoldierModel } from '../models/SoldierModel.js';

var router = Router();

router.put('/:soldierId/soldierDidntArrive', async function (req, res) {
  const soldierId = req.params.soldierId;
  const turnLimit = 3;
  const iterationCounter = 1 / (turnLimit + 1);
  try {
    await vaidateSoldierId(soldierId);

    const currentSoldier = await SoldierArrivalQueue.findOne({
      where: { soldierId },
      raw: true,
      attributes: ['turnPos']
    })
    const shouldGoBack = currentSoldier ? (currentSoldier.turnPos % 1).toFixed(2) != iterationCounter * turnLimit : false;
    if (shouldGoBack) {
      const updatedSoldier = await SoldierArrivalQueue.increment('turnPos', {
        by: 10 + iterationCounter,
        where: { soldierId }
      });
      res.status(200).send("Soldier moved back");
    }
    else {
      const deletedSoldier = await SoldierArrivalQueue.destroy({
        where: { soldierId }
      })
      res.status(200).send("Soldier removed and logged");
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.post('/addSoliderToArrivalQueue', async function (req, res) {
  const soldier = req.body;
  console.log(req.body);
  try {
    const topSoldier = await SoldierArrivalQueue.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'DESC'],
      ]
    })
    const turnPos = topSoldier ? topSoldier.turnPos + 1 : 1;
    const soldierCollection = await SoldierArrivalQueue
      .create({
        soldierId: soldier.soldierId,
        turnPos
      });
    res.status(201).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/getResultGetTopSoldiers', async function (req, res) {
  try {
    SoldierModel.hasOne(SoldierArrivalQueue, { foreignKey: 'soldierId' })
    SoldierArrivalQueue.belongsTo(SoldierModel, { foreignKey: 'soldierId' })
    const soldierCollection = await SoldierArrivalQueue.findAll({
      attributes: ['soldierId', 'turnPos'],
      order: [
        ['turnPos', 'ASC'],
      ],
      limit: 50,
      include: [{
        model: SoldierModel,
        attributes: ['wasVaccinated'],
      }]
    })
    res.status(200).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});
export default router;