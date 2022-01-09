import { MongoClient, MongoClientOptions } from "mongodb";

//NOTE : Following Config is inline for basic usage. However we can use vault as per our requirement.

export interface DBConfigMongo {
    dbname: string;
    host: string;
    port: number;
}

interface DBConfigSQL {
    //Create Config When Required
}

export class DBConfig {

    public static dbconf = {
        "default": {
            dbname: 'local',
            host: 'localhost',
            port: 27017,

        } as DBConfigMongo,
         "novig": {
            dbname: 'User',
            host:'localhost',
            port: 27017,


        } as DBConfigMongo

    }

    //Assuming vault stored in Mongodb
    // public static async GetConfigFromVault() {
    //     try {

    //         let vaultconn = await MongoClient.connect(`mongodb://localhost:27017`);
    //         let vaultdb = vaultconn.db('vault');
    //         let vaultcollection = vaultdb.collection('dbconf');
    //         let result = await vaultcollection.find({}).toArray();
    //         if (result && result.length) this.dbconf = result[0];

    //     } catch (error) {
    //         console.log(error);
    //         console.log('error in Getting Conf From Vault');
    //     }
    // }

}