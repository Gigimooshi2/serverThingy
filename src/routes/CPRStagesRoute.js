import Router from 'express';
import { CPRStageModel } from '../models/CRPStagesModel.js';
import LogManager from '../LogManager.js';
import { SoldierModel } from '../models/SoldierModel.js';

var router = Router();

router.get('/GetCPRStages', async function (req, res) {
  try {
    const soldierCollection = await CPRStageModel.findAll({
      attributes: ['stageId', 'soldierId']
    })
    res.status(200).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/stage/:stageId', async function (req, res) {
  const stageId = req.params.stageId;
  try {
    const currentSoldier = await CPRStageModel.findOne({
      attributes: ['soldierId'],
      raw: true
    }, { where: { stageId } })
    res.status(200).send(currentSoldier);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/dedicateSoldierToCPRStage', async function (req, res) {
  const { stageId } = req.body;
  try {
    const topSoldier = await CPRStageModel.findOne({
      limit: 1,
      raw: true,
      where: {
        dedicatedToCPR: false
      },
      order: [
        ['turnPos', 'ASC'],
      ]
    })
    if (!topSoldier) {
      LogManager.getLogger().error("Arrival queue is empy");
      res.status(404).send("Arrival queue is empy");
      return;
    }
    const updateStage = await CPRStageModel.update({
      soldierId: topSoldier.soldierId
    }, { where: { stageId } });
    await SoldierModel.update({
      dedicatedToCPR: true
    }, { where: { soldierId: topSoldier.soldierId } });
    res.status(200).send(topSoldier.soldierId);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;
