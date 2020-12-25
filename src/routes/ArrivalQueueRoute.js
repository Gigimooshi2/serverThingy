import { Router } from 'express';
import {SoldierArrivalQueue} from '../models/SoldierArrivalQueue.js';
import LogManager from '../LogManager.js';

var router = Router();

router.post('/addSoliderToArrivalQueue', async function (req, res) {
  const soldier = req.body;
  console.log(req.body);
  try {
    const soldierCollection = await SoldierArrivalQueue
              .create({
                soldierId: soldier.soldierId,
              });
      res.status(201).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});

router.get('/getResultGetTopSoldiers', async function (req, res) {
  try {
    const soldierCollection = await SoldierArrivalQueue.findAll({
      attributes: ['soldierId'],
      limit: 50
    }) 
      res.status(201).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});
export default router;