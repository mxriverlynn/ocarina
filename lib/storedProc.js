var ConnectionManager = require("./connectionManager");

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

  ConnectionManager.getConnection((err, connection) => {
    if (err) { return cb(err); }

    var sql = buildSql(proc, bindvars);
    connection.execute(sql, bindvars, function(err, result) {
      function done(cb){
        connection.release(cb);
      }

      if (err) { 
        return done(() => cb(err));
      }

      cb(undefined, result, done);
    });
  });
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
