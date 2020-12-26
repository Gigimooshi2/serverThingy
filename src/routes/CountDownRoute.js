import Router from 'express';
import LogManager from '../LogManager.js';
import { CPRCountDownModel } from '../models/CPRCountDownModel.js';

const router = Router();

router.post('/:soldierId/wasVaccinated', async function (req, res) {
  const soldierId = req.params.soldierId;
  try {
    await vaidateSoldierId(soldierId);
    const countDown = await CPRCountDownModel.create({ soldierId });
    res.status(201).send(countDown)
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
        raw: true
      }
    );
    const now = Date.now();
    const countDownTime = 15 * 1000 * 60;
    const deleteCountdownTime = countDownTime * 2;
    const allCountDowns = [];
    soldiers.forEach(soldier => {
      const timeCountDown = now - new Date(soldier.createdAt);
      if (timeCountDown > deleteCountdownTime) {
        CPRCountDownModel.destroy({
          where: {
            soldierId: soldier.soldierId
          }
        });
      } else {
        const waintingPrecentage = Math.floor(timeCountDown / countDownTime * 100);
        allCountDowns.push({ soldierId: soldier.soldierId, waintingPrecentage: waintingPrecentage > 100 ? 100 : waintingPrecentage });
      }
    });
    res.status(200).send(allCountDowns);
  } catch (e) {
    LogManager.getLogger().error(e);
    res.status(400).send(e);
  }
});

export default router;