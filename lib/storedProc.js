// StoredProc
// ----------

function StoredProc(proc, bindvars, connection){
  if (!connection){
    connection = bindvars;
    bindvars = undefined;
  }

  this.proc = proc;
  this.bindvars = bindvars;
  this.connection = connection;

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

  var sql = buildSql(proc, bindvars);
  this.connection.execute(sql, bindvars, function(err, result) {
    if (err) { return cb(err); }

    cb(undefined, result);
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
