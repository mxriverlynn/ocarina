var Oracle = require("oracledb");
var Ocarina = require("../lib");

describe("Transactions across multiple calls", function(){
  describe("when calling multiple procs and committing a transaction around them", function(){
    var results;

    beforeEach(function(done){
      var pList = [];
      var trans = new Ocarina.Transaction();
      trans.begin(function(err, connection){
        if (err) { return fail(err); }

        pList.push(new Promise(function(res, rej){
          var proc1 = new Ocarina.StoredProc("NINJA_TEST.Insert_1", connection);
          proc1.exec(function(err, result){
            if (err) { return rej(err); }
            res(result);
          });
        }));

        pList.push(new Promise(function(res, rej){
          var proc2 = new Ocarina.StoredProc("NINJA_TEST.Insert_2", connection);
          proc2.exec(function(err, result){
            if (err) { return rej(err); }
            res(result);
          });
        }));

        Promise.all(pList)
          .then(function(resultList){
            results = resultList;
            trans.commit((err) => {
              if (err) { return fail(err); }
              done();
            });
          })
          .catch(fail);
      });

    });

    it("should commit the changes", function(){
      expect(results.length).toBe(2);
    });

    afterEach(function(done){
      Ocarina.ConnectionManager.getConnection(function(err, connection){
        var proc1 = new Ocarina.StoredProc("NINJA_TEST.Truncate_Test_Tables", connection);
        proc1.exec(function(err, result){
          if (err) { return fail(err); }
          connection.release(done);
        });
      });
    });
  });

  describe("when creating a transaction with an existing connection, and starting the transaction", function(){
    var conn, result;

    beforeEach(function(done){
      conn = {};

      var tx = new Ocarina.Transaction(conn);

      tx.begin(function(err, conn) { 
        if (err) { return fail(err); }
        
        result = conn;
        done();
      });
    });
    
    it("should use the existing connection", function(){
      expect(result).toBe(conn);
    });
  });

});
