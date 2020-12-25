import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;


export class CPRCountDownModel extends Model {
	static isInitialized = false;
	soldierId;

	static initialize(sequelize) {
		if (CPRCountDownModel.isInitialized) {
			return;
		}

		CPRCountDownModel.init(
			{
				soldierId: {
					type: DataTypes.STRING(10),
					primaryKey: true,
					allowNull: false,
				}
			},
			{
				tableName: "CPRCountDown",
				modelName: "CPRCountDown",
				sequelize: sequelize,
			}
		);

		CPRCountDownModel.isInitialized = true;
	}
}
