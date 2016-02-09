var ConnectionManager = require("./connectionManager");

// StoredProc
// -------

function StoredProc(proc, bindvars){
  this.proc = "call " + proc;
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

    connection.execute(proc, bindvars, function(err, result) {
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

// Alias
// -----

StoredProc.prototype.execute = StoredProc.prototype.exec;

// Exports
// -------

module.exports = StoredProc;
