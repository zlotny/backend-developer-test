import Log from '../utils/Log';
import Game from 'models/Game';
import { Config } from './Configuration';

const GameModel: any = new Game().getModelForClass(Game);

export default class DatabaseSeeder {

    /**
     * If the configuration has seeding enabled, checks if some collections
     * are empty and fills them with sample data.
     * @param  {any} err - Error coming for mongoose connection
     * @param  {any} db - Mongoose connected database to query
     * @returns Promise
     */
    public static async handler(err: any, db: any): Promise<void> {
        if(err){
            Log.Instance.info(err);
        }
        if (Config.seedDataIfDBEmpty) {
            db.collection("games").countDocuments(async (err: any, count: number): Promise<void> => {
                if (count === 0) {
                    Log.Instance.info("Seeding initial data");
                    await Promise.all([
                        new GameModel({
                            title: "Chess",
                            description: "Chess is a two-player strategy board game played on a chessboard, a checkered gameboard with 64 squares arranged in an 8×8 grid",
                            minPlayers: 2,
                            maxPlayers: 2
                        }).save(),
                        new GameModel({
                            title: "Settlers of Catan",
                            description: "The Settlers of Catan is a multiplayer board game designed by Klaus Teuber and first published in 1995 in Germany",
                            minPlayers: 3,
                            maxPlayers: 4
                        }).save(),
                        new GameModel({
                            title: "Risk",
                            description: "Risk is a strategy board game of diplomacy, conflict and conquest",
                            minPlayers: 3,
                            maxPlayers: 5
                        }).save(),
                    ]);
                    Log.Instance.info("Database seeding complete");
                }
            });
        }
    }
}