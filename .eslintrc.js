module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        'airbnb-base', 
        'eslint:recommended',
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "no-param-reassign": ["error", { "props": false }],
        "no-console": ["error", { allow: ["log", "warn", "error"] }],
        //"no-plusplus:": [2, { allowForLoopAfterthoughts: true }],
    }
};