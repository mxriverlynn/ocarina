var Oracle = require("oracledb");
var Ocarina = require("../lib");

describe("stored proc", function(){
  var connection;

  beforeEach((done) => {
   Ocarina.ConnectionManager.getConnection((err, conn) => {
     if (err) { throw err; }
     connection = conn;
     done();
   });
  });

  describe("when executing a stored proc", function(){
    var proc, result;

    beforeEach(function(testComplete){
      proc = new Ocarina.StoredProc("NINJA_TEST.Test_Win", connection);

      proc.exec(function(err, res){
        if (err) { throw err; }

        result = res;
        if (err) { throw err; }
        testComplete();
      });
    });

    it("should return the results", function(){
      expect(result).not.toBe(undefined);
    });
  });

  describe("when executing a non-existent stored proc", function(){
    var proc, result;

    beforeEach(function(testComplete){
      proc = new Ocarina.StoredProc("NINJA_TEST.DOES_NOT_EXIST", connection);

      proc.exec(function(err){
        result = err;
        testComplete();
      });
    });

    it("should return an error", function(){
      expect(result).not.toBeUndefined();
    });
  });

  afterEach((done) => {
   connection.release((err) => {
     if (err) { throw err; }
     done();
   });
  });

});
