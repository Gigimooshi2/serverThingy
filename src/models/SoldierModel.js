import sequelize_pkg from 'sequelize';
import { QuestinAnswer } from '../routes/SoldierRoute.js';
const { Model, DataTypes } = sequelize_pkg;


export class SoldierModel extends Model {
	static isInitialized = false;
	soldierId;
	wasVaccinated;
	wasArrived;
	isAbleToVaccinate;
	q1;
	q2;
	q3;
	q4;

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
					allowNull: false,
				},
				wasArrived: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				},
				isAbleToVaccinate: {
					type: new DataTypes.BOOLEAN,
					allowNull: false,
				},
				q1: {
					type: new DataTypes.BOOLEAN(),
					allowNull: false,
				},
				q2: {
					type: new DataTypes.BOOLEAN(),
					allowNull: false,
				},
				q3: {
					type: new DataTypes.BOOLEAN(),
					allowNull: false,
				},
				q4: {
					type: DataTypes.ENUM(Object.values(QuestinAnswer)),
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
