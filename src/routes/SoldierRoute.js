import Router from 'express';
import LogManager from '../LogManager.js';
import { SoldierModel } from '../models/SoldierModel.js';

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
        q4: soldier.q4
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

  try {
    await vaidateSoldierId(soldierId);
    const [_, updateSoldier] = await SoldierModel.update({
      wasVaccinated: wasVaccinated
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

  try {
    await vaidateSoldierId(soldierId);
    const updateSoldier = await SoldierModel.update(
      { q1, q2, q3, q4 },
      { where: { soldierId } }
    );
    res.status(200).send(updateSoldier);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});
