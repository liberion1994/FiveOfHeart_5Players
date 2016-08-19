/**
 * Created by liboyuan on 16/8/11.
 */

var Table = require('./table').Table;
var Property = require("../properties/property");

var TableRepo = {
    tables: [],
    currentId: 0
};

TableRepo.createTable = function () {
    var ret = new Table(TableRepo.currentId ++);
    TableRepo.tables.push(ret);
    return ret;
};

TableRepo.findTableById = function (id) {
    var len = TableRepo.tables.length;
    for (var i = 0; i < len; i ++) {
        if (TableRepo.tables[i].id == id)
            return TableRepo.tables[i];
    }
    return null;
};

TableRepo.getAllTables = function () {
    return TableRepo.tables;
};

TableRepo.init = function () {
    for (var i = 0; i < Property.TableSum; i ++)
        TableRepo.createTable();
};

module.exports = TableRepo;