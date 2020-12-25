import { Router } from 'express';
import { StageDedicatedQueue } from '../models/StageDedicatedQueue.js';
import LogManager from '../LogManager.js';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';

var router = Router();

router.get('/GetStageDedicatedSoldiers', async function (req, res) {
  try {
    const soldierCollection = await StageDedicatedQueue.findAll({
      attributes: ['stageId','soldierId']
    }) 
      res.status(200).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.post('/dedicateSoldierToStage', async function (req, res) {
  const stage = req.body;
  try {
    const topSoldier = await SoldierArrivalQueue.findOne({
      limit: 1,
      raw: true,
      order: [
        ['id', 'DESC'],
      ]
    })
    const updateStage = await StageDedicatedQueue.update({
      soldierId: topSoldier.soldierId
    }, {
      where:
      {
        stageId: stage.stageId
      }
    });
    await SoldierArrivalQueue.destroy({
      where: {
        soldierId: topSoldier.soldierId
      }
    })
    res.status(200).send(updateStage);

  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;