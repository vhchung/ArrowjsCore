"use strict";

module.exports = function(){
    //let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    let err = new Error;
    //Error.captureStackTrace(err, arguments.callee);
    let stack = err.stack;
    //Error.prepareStackTrace = orig;
    return stack;
};
