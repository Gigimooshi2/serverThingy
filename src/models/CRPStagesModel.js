import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;

export class CPRStageModel extends Model {
	static isInitialized = false;
	soldierId;
	stageId;
	static createStages(amount) {
		try {
			for (let i = 0; i < amount; i++) {
				CPRStageModel.findOrCreate(
					{
						where: {
							stageId: i,
						},
						stageId: i,
						soldierId: null
					});
			}
		}
		catch (e) {
			print("Stages already exist.");
		}
	}
	static initialize(sequelize) {
		if (CPRStageModel.isInitialized) {
			return;
		}

		CPRStageModel.init(
			{
				stageId: {
					type: DataTypes.TINYINT.UNSIGNED,
					primaryKey: true,
					allowNull: false,
				},
				soldierId: {
					type: DataTypes.STRING(10),
					allowNull: true,
				}
			},
			{
				tableName: "CPRStageModel",
				modelName: "CPRStageModel",
				sequelize: sequelize,
			}
		);
		CPRStageModel.isInitialized = true;
	}
}
