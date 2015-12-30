//Require modules
var express = require('express'),
    app     = express(),
    mysql   = require('mysql'),
	http = require('http');
//app.listen(3000);
//console.log('On Premise SQL Demo listening on port 3000');

//Create a http server and listen on ENV PORT
http.createServer(app).listen(process.env.VCAP_APP_PORT || 3000 );
//Serve out of public folder
app.use(express.static(__dirname + '/public'));

//Database Credentials 
var dbCredentials = {

};

//Parse VCAP Services to get Database Credentials and initialize 
if(process.env.VCAP_SERVICES) {
			
			var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
			
			dbCredentials.host = vcapServices['user-provided'][0].credentials.host;
			dbCredentials.port = vcapServices['user-provided'][0].credentials.port;
			dbCredentials.user = vcapServices['user-provided'][0].credentials.username;
			dbCredentials.password = vcapServices['user-provided'][0].credentials.password;
			dbCredentials.dbname = vcapServices['user-provided'][0].credentials.dbname;
}

//Create a mySQL Connection Pool 
var pool = mysql.createPool({
  host     : dbCredentials.host,
  port 	   : dbCredentials.port,
  user     : dbCredentials.user,
  password : dbCredentials.password,
  database : dbCredentials.dbname
});

//Default sends index.html in static directory 
app.get('/', function (req, res) {

});

//READ ALL
app.get('/:Product', function(req,res){
		pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
				result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM '+req.params.Product+' ORDER BY id', req.params.id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
				else
				{
					res.send({
						result: 'success',
						err:    '',
						json:   rows,
					});
					connection.release();
				}
            });
        }
    });
});

//READ SINGLE
app.get('/:Product/:id', function(req,res){
		pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
				result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * FROM '+req.params.Product+' WHERE id =' +req.params.id, req.params.id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
				else
				{
					res.send({
						result: 'success',
						err:    '',
						json:   rows,
					});
					connection.release();
				}
            });
        }
    });
});

//UPDATE
app.post('/:Product/:id', function(req,res){});

//CREATE
app.put('/:Product',  function(req,res){
		pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
				result: 'error',
                err:    err.code
            });
        } else {
            connection.query('INSERT INTO Product (Name, Stock) VALUES (\''+req.query.Name+'\','+req.query.Stock+')', function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
				else
				{
					res.send({
						result: 'mySQL insert success',
						err:    '',
					});
					connection.release();
				}
            });
        }
    });
});

//DELETE
app.delete('/:Product/:id',  function(req,res){
		pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
				result: 'error',
                err:    err.code
            });
        } else {
            connection.query('DELETE FROM '+req.params.Product+' WHERE id =' +req.params.id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
				else
				{
					res.send({
						result: 'mySQL delete success',
						err:    '',
						json:   rows,
					});
					connection.release();
				}
            });
        }
    });
});
