import Router from 'express';
import {SoldierArrivalQueue} from '../models/SoldierArrivalQueue.js';
import LogManager from '../LogManager.js';

var router = Router();

router.post('/addSoliderToArrivalQueue', async function (req, res) {
  const soldier = req.body;
  console.log(req.body);
  try {
    const topSoldier = await SoldierArrivalQueue.findOne({
      limit: 1,
      raw: true,
      order: [
        ['turnPos', 'ASC'],
      ]
    })
    console.log("info");
    const soldierCollection = await SoldierArrivalQueue
              .create({
                soldierId: soldier.soldierId,
                turnPos: topSoldier.turnPos
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
      attributes: ['soldierId','turnPos'],
      order: [
        ['turnPos', 'ASC'],
      ],
      limit: 50
    }) 
      res.status(200).send(soldierCollection);
  } catch(e) {
      LogManager.getLogger().error(e);
      res.status(400).send(e);
  }
});
export default router;