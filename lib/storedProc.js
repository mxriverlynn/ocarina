var ConnectionManager = require("./connectionManager");

// StoredProc
// -------

function StoredProc(proc, bindvars){
  this.proc = "call " + proc;
  this.bindvars = bindvars;
}

// Methods
// -------

StoredProc.prototype.exec = function(cb){
  if (!cb){
    cb = bindvars;
    bindvars = undefined;
  }

  var proc = this.proc;
  var bindvars = this.bindvars;

  ConnectionManager.getConnection((err, connection) => {
    if (err) { return cb(err); }

    connection.execute(proc, bindvars, function(err, result) {
      function done(cb){
        connection.release(cb);
      }

      if (err) { 
        return done(() => cb(err));
      }

      cb(undefined, result.outBinds, done);
    });
  });
};

// Exports
// -------

module.exports = StoredProc;
