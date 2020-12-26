import Sequelize from "sequelize";
import LogManger from "../LogManager.js";

export class DatabaseService {
	static instance;
	sequelize;

	constructor(properties) {
		this.sequelize = new Sequelize(
			properties.get("database.dbName") || process.env.DB_NAME,
			properties.get("database.user") || process.env.USER,
			properties.get("database.password") || process.env.PASSWORD,
			{
				host: properties.get("database.host"),
				port: properties.get("database.port"),
				dialect: properties.get("database.dialect"),
				pool: {
					max: 5,
					min: 0,
					acquire: 30000,
					idle: 10000,
				},
				define: {
					charset: "utf8mb4",
					timestamps: true,
					collate: "utf8mb4_general_ci",
				},
				logging: (msg) => {
					LogManger.getLogger().info(msg);
				},
			}
		);
	}

	static getSequelize() {
		return DatabaseService.instance.sequelize;
	}

	static init(properties) {
		console.log(JSON.stringify(properties));
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService(properties);
			DatabaseService.testConnection();
		}

		return this.instance;
	}

	static testConnection() {
		DatabaseService.getSequelize()
			.authenticate()
			.then(() => {
				LogManger.getLogger().info(
					"Database connection has been established successfully."
				);
			})
			.catch((err) => {
				LogManger.getLogger().error("Unable to connect to the database:", err);
				throw new Error("Unable to connect to the database");
			});
	}
}