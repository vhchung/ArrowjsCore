'use strict';

let redis = require('redis').createClient();
let path = require('path');
let _ = require('lodash');
let fs = require('fs');
let modules = {};

module.exports = function () {
    return modules;
};

module.exports.loadAllModules = function () {
    let menuManager = require(__dirname + '/menus_manager');
    let module_tmp = {};
    // Load modules
    let moduleList =__.getOverrideCorePath(__base + 'core/modules/*/module.js', __base + 'app/modules/*/module.js', 2);

    for (let index in moduleList) {
        if (moduleList.hasOwnProperty(index)) {
            if (moduleList[index].indexOf(__base + 'core/modules') > -1) {
                // System modules
                let sysModule =  require(moduleList[index])(module_tmp)[index];
                sysModule.path = moduleList[index];
                sysModule.system = true;
                sysModule.active = true;
                //makeRoute(sysModule);

            } else {
                // App modules
                let appModule = require(moduleList[index])(module_tmp)[index];
                appModule.path = moduleList[index];
                appModule.system = false;
                appModule.active = false;
                //makeRoute(appModule);
            }
        }
    }

    // Add new module
    for (let i in module_tmp) {
        if (__modules[i] == undefined) {
            __modules[i] = module_tmp[i];
            menuManager.addMenu(i);
        } else {
            delete module_tmp[i].active;
            _.assign(__modules[i], module_tmp[i]);
            menuManager.modifyMenu(i);
        }
    }

    // Remove module
    for (let i in __modules) {
        if (module_tmp[i] == undefined) {
            menuManager.removeMenu(i);
            delete __modules[i];
        }
    }
    redis.set(__config.redis_prefix + 'all_modules', JSON.stringify(__modules), redis.print);
    __cache.set(__config.redis_prefix + 'backend_menus', JSON.stringify(__menus));
};

module.exports.makeMenu = function (myModule) {
    let menuManager = require(__dirname + '/menus_manager');

    for (let i in myModule) {
        menuManager.addMenu(i);
    }

    __cache.set(__config.redis_prefix + 'backend_menus', JSON.stringify(__menus));
}





function makeRoute(m){
    let moduleFolder = path.resolve(m.path,'..');
    if(fs.existsSync(moduleFolder+'/backend/route.js')){
        m.adminRoute = require(moduleFolder+'/backend/route.js');
    }
    if(fs.existsSync(moduleFolder+'/frontend/route.js')){
        m.frontRoute = require(moduleFolder + '/frontend/route.js');
    }
    return m
}

//modules.exports.addRoute = function (app) {
//    /** Globbing backend route files */
//    let adminRoute = __.getOverrideCorePath(__base + 'core/modules/*/backend/route.js', __base + 'app/modules/*/backend/route.js', 3);
//    for (let index in adminRoute) {
//        if (adminRoute.hasOwnProperty(index)) {
//            let arrayName = path.resolve(adminRoute[index]).split('/');
//            let moduleName = arrayName[arrayName.length - 3];
//            if (__modules[moduleName].system || __modules[moduleName].active) {
//                let myRoute = require(path.resolve(adminRoute[index]));
//                if (myRoute.name === 'router') {
//                    app.use('/' + __config.admin_prefix, myRoute);
//                } else {
//                    myRoute(app);
//                }
//
//            }
//        }
//    }
//
//
//    /** Globbing route frontend files */
//    let frontRoute = __.getOverrideCorePath(__base + 'core/modules/*/frontend/route.js', __base + 'app/modules/*/frontend/route.js', 3);
//    for (let index in frontRoute) {
//        if (frontRoute.hasOwnProperty(index)) {
//            let arrayName = path.resolve(frontRoute[index]).split('/');
//            let moduleName = arrayName[arrayName.length - 3];
//            if (__modules[moduleName].system || __modules[moduleName].active) {
//                let myRoute = require(path.resolve(frontRoute[index]));
//                if (myRoute.name === 'router') {
//                    app.use('/' + __config.admin_prefix, myRoute);
//                } else {
//                    myRoute(app);
//                }
//            }
//        }
//    }
//}