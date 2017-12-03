var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    cluster.setupMaster({
        exec: 'bin/www'
    });
    var numWorkers = numCPUs > 4? 4 : numCPUs;
    // Fork workers.
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('Worker id: ' + worker.id + ' listening at: ' + JSON.stringify(address));
    });

    Object.keys(cluster.workers).forEach(function (id) {
        console.log('Worker id: ' + id + ' with pid: ' + cluster.workers[id].process.pid);
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died: Respawning...');
        cluster.fork();
    });
}