import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;


export class StageDedicatedQueue extends Model {
	static isInitialized = false;
	soldierId;
	stageId;
	static createStages(amount){
		try{
			for(let i = 0; i<amount;i++)
			{
			StageDedicatedQueue.findOrCreate(
			{
				where:{
					stageId: i,
				},
				stageId: i,
				soldierId: null
			});
		}
		}
		catch(e){
			print("Stages already exist.");
		}
	}
	static initialize(sequelize) {
		if (StageDedicatedQueue.isInitialized) {
			return;
		}

		StageDedicatedQueue.init(
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
				tableName: "soldiersQueue",
				modelName: "soldiersQueue",
				sequelize: sequelize,
			}
		);
		StageDedicatedQueue.isInitialized = true;
	}
}
