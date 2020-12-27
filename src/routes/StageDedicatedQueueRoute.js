import Router from 'express';
import LogManager from '../LogManager.js';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';
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
    let topSoldier;
    do{
     topSoldier = await SoldierArrivalQueue.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'ASC'],
      ]
    })
    }
    while (!topSoldier){}
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
    })});
export default router;