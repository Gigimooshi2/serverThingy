import Router from 'express';
import LogManager from '../LogManager.js';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';
import { SoldierModel } from '../models/SoldierModel.js';
import { StageDedicatedQueue } from '../models/StageDedicatedQueue.js';

var router = Router();

router.get('/GetStageDedicatedSoldiers', async function (req, res) {
  try {
    const soldierCollection = await StageDedicatedQueue.findAll({
      attributes: ['stageId', 'soldierId']
    })
    res.status(200).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/:stageId/getSoldierDedicatedToStage', async function (req, res) {
  const stageId = req.params.stageId;
  try {
    const currentSoldier = await StageDedicatedQueue.findOne({
      attributes: ['soldierId'],
      raw: true,
      where: { stageId }
    })
    res.status(200).send(currentSoldier);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:stageId/removeSoldierFromStage', async function (req, res) {
  const stageId = req.params.stageId;
  try {
    const [_, stage] = await StageDedicatedQueue.update({
      soldierId: null
    }, {
      where: { stageId }
    })
    res.status(200).send(stage);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.post('/dedicateSoldierToStage', async function (req, res) {
  const stage = req.body;
  let transaction;
  try {
    transaction = await SoldierArrivalQueue.sequelize.transaction();
    const topSoldier = await SoldierArrivalQueue.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'ASC'],
      ],
      transaction,
      lock: true
    });

    if (!topSoldier) {
      if (transaction) await transaction.rollback();
      LogManager.getLogger().error("Arrival queue is empy");
      res.status(400).send("Arrival queue is empy");
      return;
    }

    await StageDedicatedQueue.update({
      soldierId: topSoldier.soldierId
    }, {
      where: { stageId: stage.stageId },
      transaction
    });
    await SoldierModel.increment('arrivalQueueRetryCount', {
      by: 1,
      where: { soldierId: topSoldier.soldierId },
      transaction
    });
    const wasDeleted = await SoldierArrivalQueue.destroy({
      where: {
        soldierId: topSoldier.soldierId
      },
      transaction
    });
    if (!wasDeleted) {
      await transaction.rollback();
      LogManager.getLogger().error(`soldier ${topSoldier.soldierId} already destroyed`);
      res.status(400).send(`soldier ${topSoldier.soldierId} already destroyed`);
      return;
    }
    await transaction.commit();
    res.status(200).send(topSoldier.soldierId);

  } catch (e) {
    if (transaction) await transaction.rollback();
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;