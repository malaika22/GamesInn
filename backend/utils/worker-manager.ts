import * as cp from "child_process";
import path from "path";
import { DBConfig } from "../configs/database";
import { WorkerLock } from "../models/locking-model";
import { Logger } from "../server/logger";


enum LockTypes {
    "SYNC_TEST" = 'synctest'
}
export abstract class WorkerManager {

    constructor() { }


    public static async StartWorker() {

        if (await WorkerLock.isLocked(LockTypes.SYNC_TEST)) return;
        else {
            console.log('Inside worker manager')
            await WorkerLock.CreateLock(LockTypes.SYNC_TEST)

            let worker = cp.fork(process.cwd() + '/build/workers/sync-matches.js', { env: { conf: JSON.stringify(DBConfig.dbconf.default) } as any, detached: true });
            worker.on('message', (msg: any) => {
                Logger.Console(`Message Received From Child : ${msg.toString()}`);
            })
            worker.on('error', (err: any) => {
                Logger.Console(`error in Worker : ${err.toString()}`);
            })
            worker.on('exit', async (code) => {
                Logger.Console(`Worker Exited : ${code?.toString()}`);
                await WorkerLock.ReleaseLock(LockTypes.SYNC_TEST);
            })

            worker.on('close', async (code) => {
                Logger.Console(`Worker Closed : ${code?.toString()}`);
                await WorkerLock.ReleaseLock(LockTypes.SYNC_TEST);

            })

            worker.on('spawn', (code: any) => {
                Logger.Console(`Worker Closed : ${code?.toString()}`);

            })
            worker.unref();

        }
    }



}