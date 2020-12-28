import Router from 'express';
import LogManager from '../LogManager.js';
import { CPRCountDownModel } from '../models/CPRCountDownModel.js';
import { CPRStageModel } from '../models/CRPStagesModel.js';
import { SoldierArrivalQueue } from '../models/SoldierArrivalQueue.js';
import { SoldierModel } from '../models/SoldierModel.js';
import { StageDedicatedQueue } from '../models/StageDedicatedQueue.js';
import sequelize_pkg from 'sequelize';
const { Op } = sequelize_pkg;

export const router = Router();

export const QuestinAnswer = Object.freeze({ "yes": 0, "no": 1, "first": 2 })

export const vaidateSoldierId = async (soldierId) => {
  const soldierCollection = await SoldierModel.findOne({
    where: { soldierId }
  });
  if (!soldierCollection) {
    throw new Error('soldier not found');
  }
}

router.post('/addSoldierToSoldierTable', async function (req, res) {
  const soldier = req.body;
  try {
    const soldierCollection = await SoldierModel
      .create({
        soldierId: soldier.soldierId,
        q1: soldier.q1,
        q2: soldier.q2,
        q3: soldier.q3,
        q4: soldier.q4,
        q5: soldier.q5
      });
    res.status(201).send(soldierCollection);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/soldierInfo/:soldierId', async function (req, res) {
  const soldierId = req.params.soldierId;
  try {
    const soldierCollection = await SoldierModel.findOne({
      where: { soldierId }
    });
    if (!soldierCollection) {
      throw new Error('soldier not found');
    }
    res.status(200).send(soldierCollection)
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/vaccination_ability', async function (req, res) {
  const soldierId = req.params.soldierId;
  const able = req.body.isAbleToVaccinate;

  try {
    await vaidateSoldierId(soldierId);
    const [_, updateSoldier] = await SoldierModel.update({
      isAbleToVaccinate: able
    }, {
      where: { soldierId }
    });
    res.status(200).send(updateSoldier)
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/cprDone', async function (req, res) {
  const soldierId = req.params.soldierId;

  try {
    await vaidateSoldierId(soldierId);
    const [_, updateSoldier] = await SoldierModel.update({
      cprDone: true
    }, {
      where: { soldierId }
    });
    res.status(200).send(updateSoldier)
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/:soldierId/was_vaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  const wasVaccinated = req.body.wasVaccinated;
  console.log("here")
  try {
    await vaidateSoldierId(soldierId);
    const [_, updateSoldier] = await SoldierModel.update({
      wasVaccinated: wasVaccinated,
      vaccineTime: Date.now()
    }, {
      where:
      {
        soldierId
      }
    });
    res.status(200).send(updateSoldier);
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
  const q4 = req.body.q4;
  const q5 = req.body.q5;
  try {
    await vaidateSoldierId(soldierId);
    const updateSoldier = await SoldierModel.update(
      { q1, q2, q3, q4, q5 },
      { where: { soldierId } }
    );
    res.status(200).send(updateSoldier);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});


router.delete('/deleteSoldier/:soldierId', async function (req, res) {
  const soldierId = req.params.soldierId;

  console.log(`Deleting soldier with id ${soldierId} from all tables`);
  try {
    await SoldierModel.destroy({
      where: {
        soldierId
      }
    });

    await CPRCountDownModel.destroy({
      where: { soldierId }
    });

    await CPRStageModel.update({ soldierId: null },
      {
        where: { soldierId }
      });

    await StageDedicatedQueue.update({ soldierId: null },
      {
        where: { soldierId }
      });

    await SoldierArrivalQueue.destroy({
      where: { soldierId }
    });

    res.status(200).send(`Soldier with Id: ${soldierId} was deleted successfully`);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put(`/:soldierId/vaccinatedAndEnterNotVaccinated`, async (res, req) => {
  try {
    let soldierId = req.params.soldierId;

    await SoldierModel.update(
      {
        wasVaccinated: true,
      },
      {
        where: { soldierId }
      });

    const bottomSoldier = await CPRCountDownModel.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'DESC'],
      ]
    });
    const turnPos = bottomSoldier ? bottomSoldier.turnPos + 1 : 1;

    await CPRCountDownModel.create({
      soldierId,
      turnPos
    });

    res.status(200).send(`Soldier with Id: ${soldierId} marked as vaccined succesfully`);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.put(`/:soldierId/didntVaccintedButEnterVaccinated`, async (req, res) => {
  try {
    let soldierId = req.params.soldierId;

    await SoldierModel.update(
      {
        wasVaccinated: false,
      },
      {
        where: { soldierId }
      });

    await CPRCountDownModel.destroy({
      where: { soldierId }
    });

    res.status(200).send(`Soldier with Id: ${soldierId} marked as not vaccinated succesfully`);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get(`/getAllVaccinatedSoldiers`, async (req, res) => {
  try {
    var startTime = new Date();
    startTime.setHours(0, 0, 0, 1);
    var endTime = new Date();
    endTime.setHours(23, 59, 59, 59);

    const soldiers = await SoldierModel.findAll(
      {
        raw: true,
        where: {
          wasVaccinated: true,
          vaccineTime: {
            [Op.between]: [startTime, endTime]
          }
        },
        order: [
          ["vaccineTime", "ASC"]
        ],
        attributes: ['soldierId', 'vaccineTime']
      });

    res.status(200).send({ soldiers });
  } catch (e) {
    res.status(400).send(e);
  }
});