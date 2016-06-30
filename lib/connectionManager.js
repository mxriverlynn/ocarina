var oracledb = require("oracledb");

// settings
// --------

const storageKey = Symbol("Ocarina.Oracle.Connection");

// Connection Manager
// ------------------

var ConnectionManager = {};

// Methods
// -------

ConnectionManager.connect = function(config, cb){
  oracledb.createPool(config, function(err, pool) {
    if (err) { 
      Error.captureStackTrace(err);
      return cb(err); 
    }

    ConnectionManager[storageKey] = pool;
    cb();
  });
};

ConnectionManager.disconnect = function(cb){
  var pool = ConnectionManager[pool];

  if (!pool){
    return cb();
  }

  pool.terminate((err) => {
    if (err) {
      Error.captureStackTrace(err);
      return cb(err);
    } else {
      return cb();
    }
  });
};

ConnectionManager.getConnection = function(cb){
  var pool = ConnectionManager[storageKey];

  if (!pool){
    var err = new Error("No connection pool available for Oracle.");
    err.name = "NoOracleConnection";
    return cb(err);
  }

  pool.getConnection(cb);
};

// Exports
// -------

module.exports = ConnectionManager;
