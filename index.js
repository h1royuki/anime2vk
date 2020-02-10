require('dotenv').config();
const {Worker} = require('worker_threads');
const fs = require('fs');

const accs = {};
const workers = [];

const usersPerWorker = Math.ceil((process.env.LIMIT - 4770) / process.env.THREADS);

for (let i = 1; i <= process.env.THREADS; i++) {
    const startId = usersPerWorker * i;
    const endId = (usersPerWorker * (i + 1)) - 1;

    const worker = new Worker(__dirname + '/worker.js', {
        workerData: {id: i, start: startId, end: endId},
    });

    worker.on('message', (data) => {
        if(data.id) {
            accs[data.id] = {name: data.name, vk: data.vk};
        } else {
            console.log(data);
        }
    });

    worker.on('close', () => {
        console.log('Worker stopped.');
    });

    workers.push(worker);
}

fs.writeFileSync('accs.json', accs);


