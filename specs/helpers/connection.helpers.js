var epa = require("epa").getEnvironment();
var Ocarina = require("../../lib");

var connection = {
  user: epa.get("OCARINA_USER"),
  password: epa.get("OCARINA_PASSWORD"),
  connectString: epa.get("OCARINA_TNS")
};

beforeEach(function(done){
  Ocarina.ConnectionManager.connect(connection, function(err){
    if (err) { return setImmediate(function(){ throw err; }); }

    done();
  });
});

afterEach(function(done){
  Ocarina.ConnectionManager.disconnect(function(err){
    if (err) { return setImmediate(function(){ throw err; }); }

    done();
  });
});
