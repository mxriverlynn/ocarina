var Oracle = require("oracledb");
var Ocarina = require("../lib");

describe("Transactions across multiple calls", function(){

  describe("when calling multiple procs and committing a transaction around them", function(){
    var results;

    beforeEach(function(done){
      var pList = [];
      var trans = new Ocarina.Transaction();

      pList.push(new Promise(function(res, rej){
        var proc1 = new Ocarina.StoredProc("NINJA_TEST.Test_Win", {}, trans);
        proc1.exec(function(err, result){
          if (err) { return rej(err); }
          res(result);
        });
      }));

      pList.push(new Promise(function(res, rej){
        var proc2 = new Ocarina.StoredProc("NINJA_TEST.Test_Win", {}, trans);
        proc2.exec(function(err, result){
          if (err) { return rej(err); }
          res(result);
        });
      }));

      Promise.all(pList)
        .then(function(resultList){
          results = resultList;
          trans.commit((err) => {
            if (err) { console.log(err.stack); throw err; }
            done();
          });
        })
        .catch(function(err){
          setImmediate(() => { console.log(err.stack); throw err; });
        });

    });

    it("should commit the changes", function(){
      expect(results.length).toBe(2);
    });
  });

});
