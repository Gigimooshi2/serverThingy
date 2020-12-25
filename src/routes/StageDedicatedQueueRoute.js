import { Router } from 'express';
import {SoldierArrivalQueue} from '../models/SoldierArrivalQueue.js';
import LogManager from '../LogManager.js';

var router = Router();

router.post('/dedicateSoldierToStage', async function (req, res) {
  const stage = req.body;
  console.log(req.body);
  try {
    const soldierCollection = await SoldierArrivalQueue
              .create({
                soldierId: stage.soldierId,
              });
      res.status(201).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

export default router;