import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;


export class SoldierArrivalQueue extends Model {
	static isInitialized = false;
	soldierId;
	stage; // 1/2
	static initialize(sequelize) {
		if (SoldierArrivalQueue.isInitialized) {
			return;
		}

		SoldierArrivalQueue.init(
			{
				soldierId: {
					type: DataTypes.STRING(10),
					allowNull: true,
                }
			},
			{
				tableName: "arrivalQueue",
				modelName: "arrivalQueue",
				sequelize: sequelize,
			}
		);
		SoldierArrivalQueue.isInitialized = true;
	}
}
