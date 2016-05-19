var Oracle = require("oracledb");
var Ocarina = require("../lib");

describe("stored proc", function(){

  describe("when executing a stored proc", function(){
    var proc, result;

    beforeEach(function(testComplete){
      proc = new Ocarina.StoredProc("NINJA_TEST.Test_Win");

      proc.exec(function(err, res, done){
        if (err) { throw err; }

        result = res;
        done((err) => {
          if (err) { throw err; }
          testComplete();
        });
      });
    });

    it("should return the results", function(){
      expect(result).not.toBe(undefined);
    });
  });

  describe("when executing a non-existent stored proc", function(){
    var proc, result;

    beforeEach(function(testComplete){
      proc = new Ocarina.StoredProc("NINJA_TEST.DOES_NOT_EXIST");

      proc.exec(function(err){
        result = err;
        testComplete();
      });
    });

    it("should return an error", function(){
      expect(result).not.toBeUndefined();
    });
  });

});
