"use strict";

module.exports = {
    resource : {
        path : 'public',
        option : {
            maxAge: 3600
        }
    },
    viewExtension : "html",
    pagination: {
        number_item: 20
    },
    theme: "default",
    functionFolder : '/extendsView/function',
    filterFolder : '/extendsView/filter',
    variableFile : '/extendsView/variable.js'

};