import { Environment } from "./interfaces/environment";
import { Application } from './app';
import fs from 'fs/promises';
import 'source-map-support/register'


let application = new Application();
/**
 * @NOTE : SErvice name spelling mistake is intentional because logger filters t he pii Keywords in which Auth/Authentication will not be printed in log.
 * So We changed the spelling in order to keep it functional.
 */
(async () => {
    let env: Environment = JSON.parse((await fs.readFile(__dirname + `/environments/environment.json`)).toString());
    console.log(env,'env');
    
    application.INIT(env);
})();

