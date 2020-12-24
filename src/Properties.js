import PropertiesReader from 'properties-reader';
import fs from 'fs';

const path = './envs/' + process.env.NODE_ENV.trim() + '.properties';

if (!fs.existsSync(path)) {
    throw new Error('Properties file for NODE_ENV=' + path + ' wasn\'t found at ' + path);
}

var properties = new PropertiesReader(path);

export default properties;