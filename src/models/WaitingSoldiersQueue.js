import sequelize_pkg from 'sequelize';
const { Model, DataTypes } = sequelize_pkg;


export class WaitingSoldiersQueue extends Model {
	static isInitialized = false;
	soldierId;
	stage; // 1/2
	static createStages(amount){
		try{
			for(let i = 0; i<amount;i++)
			{
			WaitingSoldiersQueue.findOrCreate(
			{
				where:{
					stage: i,
				},
				stage: i,
				soldierId: null
			});
		}
		}
		catch(e){
			print("Stages already exist.");
		}
	}
	static initialize(sequelize) {
		if (WaitingSoldiersQueue.isInitialized) {
			return;
		}

		WaitingSoldiersQueue.init(
			{
				stage: {
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
		WaitingSoldiersQueue.isInitialized = true;
	}
}
