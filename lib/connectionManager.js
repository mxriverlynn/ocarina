var oracledb = require("oracledb");

// settings
// --------

const storageKey = Symbol("oracle.connection");

// Connection Manager
// ------------------

var ConnectionManager = {};

// Methods
// -------

ConnectionManager.connect = function(config, cb){
  oracledb.createPool(config, function(err, pool) {
    if (err) { return cb(err); }

    ConnectionManager[storageKey] = pool;
    cb();
  });
};

ConnectionManager.disconnect = function(cb){
  var pool = ConnectionManager[pool];

  if (!pool){
    return cb();
  }

  pool.terminate(cb);
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
