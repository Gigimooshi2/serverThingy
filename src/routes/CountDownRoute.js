import Router from 'express';
import LogManager from '../LogManager.js';
import { CPRCountDownModel } from '../models/CPRCountDownModel.js';
import { SoldierModel } from '../models/SoldierModel.js';
import { vaidateSoldierId } from './SoldierRoute.js'
const router = Router();

router.post('/:soldierId/wasVaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  try {
    const topSoldier = await CPRCountDownModel.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'DESC'],
      ]
    });
    const turnPos = topSoldier ? topSoldier.turnPos + 1 : 1;
    const countDown = await CPRCountDownModel.create({ soldierId, turnPos });
    res.status(201).send(countDown)
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.put('/setWasArrivedToCprStation', async function (req, res) {
  const { soldierId, wasArrivedToCprStation } = req.body;
  try {
    await vaidateSoldierId(soldierId);
    if (wasArrivedToCprStation) {
      const [_, updateSoldier] = await SoldierModel.update({
        wasArrivedToCPRStation: true
      }, {
        where: { soldierId }
      });
      res.status(200).send(updateSoldier)
    } else {
      const turnLimit = 3;
      const iterationCounter = 1 / (turnLimit + 1);
      try {
        const currentSoldier = await CPRCountDownModel.findOne({
          where: { soldierId },
          attributes: ['turnPos']
        });
        if ((currentSoldier.turnPos % 1).toFixed(2) != iterationCounter * turnLimit) {
          const updatedSoldier = await CPRCountDownModel.increment('turnPos', {
            by: 10 + iterationCounter,
            where: { soldierId }
          });
          res.status(200).send(`Soldier moved back`);
        }
        else {
          const deletedSoldier = await CPRCountDownModel.destroy({
            where: { soldierId }
          })
          res.status(200).send("Soldier removed and logged");
        }
      } catch (e) {
        LogManager.getLogger().error(e);
        res.status(400).send(e);
      }
    }
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

router.get('/getAllCountdowns', async function (req, res) {
  try {
    const soldiers = await CPRCountDownModel.findAll(
      {
        attributes: ['soldierId', 'createdAt'],
        raw: true,
        order: [
          ['turnPos', 'ASC'],
        ]
      }
    );
    const now = Date.now();
    const countDownTime = 15 * 1000 * 60;
    const deleteCountdownTime = countDownTime * 2;
    const allCountDowns = [];
    await Promise.all(soldiers.map(async (soldier) => {
      const timeCountDown = now - new Date(soldier.createdAt);
      const { wasArrivedToCPRStation } = await SoldierModel.findOne({ where: { soldierId: soldier.soldierId }, attributes: ['wasArrivedToCPRStation'] });
      if (timeCountDown > deleteCountdownTime && wasArrivedToCPRStation) {
        CPRCountDownModel.destroy({
          where: {
            soldierId: soldier.soldierId
          }
        });
      } else {
        const waintingPrecentage = Math.floor(timeCountDown / countDownTime * 100);
        allCountDowns.push({ soldierId: soldier.soldierId, waintingPrecentage: waintingPrecentage > 100 ? 100 : waintingPrecentage, wasArrivedToCPRStation });
      }
    }));
    res.status(200).send(allCountDowns);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;