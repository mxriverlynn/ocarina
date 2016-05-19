var ConnectionManager = require("./connectionManager");

// Private Symbols
// ---------------

const GET_CONNECTION = Symbol("Ocarina.Connection.Get");

// StoredProc
// -------

function StoredProc(proc, bindvars){
  this.proc = proc;
  this.bindvars = bindvars;
}

// Methods
// -------

StoredProc.prototype.exec = function(bindvars, cb){
  if (!cb){
    cb = bindvars;
    bindvars = undefined;
  }

  var proc = this.proc;
  bindvars = bindvars || this.bindvars || {};

  this[GET_CONNECTION]((err, connection) => {
    if (err) { return cb(err); }

    var sql = buildSql(proc, bindvars);
    connection.execute(sql, bindvars, function(err, result) {
      if (err) { return cb(err); }

      function done(cb){ connection.release(cb); }
      cb(undefined, result, done);
    });
  });
};

// Private API
// -----------

StoredProc.prototype[GET_CONNECTION] = function(cb){
  ConnectionManager.getConnection(cb);
};

// Helpers
// -------

function buildSql(proc, bindvars){
  var params = Object.keys(bindvars).map((key) => {
    return key + " => :" + key;
  });

  var paramString = params.join(", ");

  var sql = "BEGIN " + proc + "(" + paramString + "); END;";

  return sql;
}

// Alias
// -----

StoredProc.prototype.execute = StoredProc.prototype.exec;

// Exports
// -------

module.exports = StoredProc;
