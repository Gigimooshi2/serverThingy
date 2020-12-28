import sequelize_pkg from 'sequelize';
import { QuestinAnswer } from '../routes/SoldierRoute.js';
const { Model, DataTypes } = sequelize_pkg;


export class SoldierModel extends Model {
	static isInitialized = false;
	soldierId;
	wasVaccinated;
	wasArrived;
	isAbleToVaccinate;
	wasArrivedToCPRStation;
	dedicatedToCPR;
	arrivalQueueRetryCount;
	q1;
	q2;
	q3;
	q4;
	q5;
	
	static initialize(sequelize) {
		if (SoldierModel.isInitialized) {
			return;
		}

		SoldierModel.init(
			{
				soldierId: {
					type: DataTypes.STRING(10),
					primaryKey: true,
					allowNull: false,
				},
				wasVaccinated: {
					type: new DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				},
				wasArrived: {
					type: new DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				},
				isAbleToVaccinate: {
					type: new DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				},
				wasArrivedToCPRStation: {
					type: new DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				},
				dedicatedToCPR: {
					type: new DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
				},
				arrivalQueueRetryCount: {
					type: DataTypes.TINYINT.UNSIGNED,
					defaultValue: 0
				},
				q1: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				},
				q2: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				},
				q3: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				},
				q4: {
					type: DataTypes.ENUM(Object.keys(QuestinAnswer)),
					allowNull: false,
				},
				q5: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				}
			},
			{
				tableName: "soldiers",
				modelName: "soldiers",
				sequelize: sequelize,
			}
		);

		SoldierModel.isInitialized = true;
	}
}
