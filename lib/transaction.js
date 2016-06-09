var ConnectionManager = require("./connectionManager");

// Private Symbols
// ---------------

const CONNECTION_KEY = Symbol("Ocarina.Transaction.Connection");
const ACTION_KEY = Symbol("Ocarina.Transaction.Action");

// Transaction
// -----------

function Transaction(connection){
  if (connection){
    this._setConnection(connection);
  }
}

// API
// ---

Transaction.prototype.begin = function(cb){
  if (this._hasConnection()){
    return cb(undefined, this._getConnection());
  }
  
  ConnectionManager.getConnection((err, conn) => {
    if (err) { return cb(err); }
    this._setConnection(conn);
    return cb(undefined, conn);
  });
};

Transaction.prototype.getConnection = function(cb){
  if (this._hasConnection()){
    return cb(undefined, this._getConnection());
  }

  var err = new Error("No Connection Available; Please Begin The Transaction.");
  err.name = "NoConnectionError";
  Error.captureStackTrace(err, Transaction.prototype.getConnection);
  throw err;
};

Transaction.prototype.commit = function(cb){
  return this[ACTION_KEY]("commit", cb);
};

Transaction.prototype.rollback = function(cb){
  return this[ACTION_KEY]("rollback", cb);
};

// Private API
// -----------

Transaction.prototype._hasConnection = function(){
  return !!this[CONNECTION_KEY];
};

Transaction.prototype._getConnection = function(){
  return this[CONNECTION_KEY];
};

Transaction.prototype._setConnection = function(conn){
  this[CONNECTION_KEY] = conn;
};

Transaction.prototype[ACTION_KEY] = function(action, cb){
  this.getConnection(function(err, connection){
    if (err) { return cb(err); }
    connection[action](cb);
  });
};

// Exports
// -------

module.exports = Transaction;
