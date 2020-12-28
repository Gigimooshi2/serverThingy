import Router from 'express';
import { CPRStageModel } from '../models/CRPStagesModel.js';
import LogManager from '../LogManager.js';
import { SoldierModel } from '../models/SoldierModel.js';
import { CPRCountDownModel } from '../models/CPRCountDownModel.js';
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

router.get('/cprStage/:stageId', async function (req, res) {
  const stageId = req.params.stageId;
  try {
    const currentSoldier = await CPRStageModel.findOne({
      attributes: ['soldierId'], where: { stageId }, raw: true
    });
    res.status(200).send(currentSoldier);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:stageId/removeSoldierFromCPRStage', async function (req, res) {
  const stageId = req.params.stageId;
  try {
    const [_, stage] = await CPRStageModel.update({
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

const getTopSoldier = async (isVip) => {
  return await CPRCountDownModel.findOne({
    limit: 1,
    raw: true,
    order: [
      ['turnPos', 'ASC'],
    ],
    include: [{
      model: SoldierModel,
      where: {
        dedicatedToCPR: false,
        isVip
      }
    }]
  });
}

router.get('/:stationId/callNextSoldierToCprStation', async function (req, res) {
  const stageId = req.params.stationId;
  try {
    SoldierModel.hasOne(CPRCountDownModel, { foreignKey: 'soldierId' });
    CPRCountDownModel.belongsTo(SoldierModel, { foreignKey: 'soldierId' });

    let topSoldier = await getTopSoldier(true);
    if (!topSoldier) {
      topSoldier = await getTopSoldier(false);
    }
    if (!topSoldier) {
      LogManager.getLogger().error("Arrival queue is empy");
      res.status(400).send("Arrival queue is empy");
      return;
    }

    await CPRStageModel.update({
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
