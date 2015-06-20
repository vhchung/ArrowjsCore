'use strict';

let redis = require('redis').createClient();
let path = require('path');
let _ = require('lodash');
let modules = {};

module.exports = function () {
    return modules;
};

module.exports.loadAllModules = function () {
    let module_tmp = {};

    // Load modules
    let adminModules = __config.getOverrideCorePath(__base + 'core/modules/*/module.js', __base + 'app/modules/*/module.js', 2);
    for (let index in adminModules) {
        if (adminModules.hasOwnProperty(index)) {
            require(path.resolve(adminModules[index]))(module_tmp);
        }
    }

    // Add new module
    for (let i in module_tmp) {
        if (__modules[i] == undefined) {
            __modules[i] = module_tmp[i];
        }
        else {
            delete module_tmp[i].active;
            _.assign(__modules[i], module_tmp[i]);
        }
    }

    // Remove module
    for (let i in __modules) {
        if (module_tmp[i] == undefined) {
            delete __modules[i];
        }
    }

    redis.set(__config.redis_prefix +'all_modules', JSON.stringify(__modules), redis.print);
};