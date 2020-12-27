import Router from 'express';
import { CPRStageModel } from '../models/CRPStagesModel';
import LogManager from '../LogManager.js';

var router = Router();

router.get('/GetCPRStageDedicatedSoldiers', async function (req, res) {
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

router.get('/:stageId/getSoldierDedicatedToStage', async function (req, res) {
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

router.post('/dedicateSoldierToStage', async function (req, res) {
  const stage = req.body;
  try {
    const topSoldier = await CPRStageModel.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'ASC'],
      ]
    })
    const updateStage = await CPRStageModel.update({
      soldierId: topSoldier.soldierId
    }, {
      where:
      {
        stageId: stage.stageId
      }
    });
    await CPRStageModel.destroy({
      where: {
        soldierId: topSoldier.soldierId
      }
    })
    res.status(200).send(topSoldier.soldierId);

  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;