import Router from 'express';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';
import LogManager from '../LogManager.js';
import { vaidateSoldierId } from './SoldierRoute.js'
import { SoldierModel } from '../models/SoldierModel.js';

var router = Router();

router.put('/:soldierId/soldierDidntArrive', async function (req, res) {
  const soldierId = req.params.soldierId;
  const turnLimit = 3;
  try {
    await vaidateSoldierId(soldierId);

    const currentSoldier = await SoldierModel.findOne({
      where: { soldierId },
      raw: true,
      attributes: ['arrivalQueueRetryCount']
    });
    if (currentSoldier) {
      if (currentSoldier.arrivalQueueRetryCount < turnLimit) {
        const topSoldier = await SoldierArrivalQueue.findOne({
          limit: 1,
          raw: true,
          attributes: ['turnPos'],
          order: [
            ['turnPos', 'ASC'],
          ]
        });
        const turnPos = topSoldier ? topSoldier.turnPos + 10.5 : 1;
        const updatedSoldier = await SoldierArrivalQueue.create({
          turnPos,
          soldierId
        });
        res.status(200).send(updatedSoldier);
      }
      else {
        res.status(200).send(`Soldier ${soldierId} is out from arrival queue`);
      }
    } else {
      res.status(404).send("soldier not found");
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