let  replace = require('replace-in-file');
let package = require("./package.json");
let year=new Date().getFullYear().toString().substr(-2);
let month=(new Date().getMonth()< 10 ? '0' : '')+(new Date().getMonth()+1);
let day=(new Date().getDate()< 10 ? '0' : '')+new Date().getDate();
let yourDate =year +"."+month+"."+day+"."+new Date().getHours()+new Date().getMinutes() ;
let buildVersion = yourDate;

const options = {
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '"+ buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(options);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
   
}
catch (error) {
    throw error
}