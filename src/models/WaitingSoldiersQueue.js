import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;


export class WaitingSoldiersQueue extends Model {
	static isInitialized = false;
	soldierId;
    stage; // 1/2

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
				stage: {
					type: DataTypes.TINYINT.UNSIGNED,
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
