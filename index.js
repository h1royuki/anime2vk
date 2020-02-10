require('dotenv').config();
const {Worker} = require('worker_threads');
const fs = require('fs');
const cliProgress = require('cli-progress');

const workers = [];

const bar = new cliProgress.SingleBar({
    format: 'Workers [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}'
}, cliProgress.Presets.shades_classic);

bar.start(process.env.LIMIT, 0);

fs.unlink('accs.json', () => {});
const stream = fs.createWriteStream('accs.json', {flags: 'a'});
stream.write('[');

const usersPerWorker = Math.ceil((process.env.LIMIT - 4770) / process.env.THREADS);

for (let i = 1; i <= process.env.THREADS; i++) {
    const startId = usersPerWorker * i + 4770;
    const endId = (usersPerWorker * (i + 1)) + 4769;

    const worker = new Worker(__dirname + '/worker.js', {
        workerData: {id: i, start: startId, end: endId},
    });

    worker.on('message', (data) => {
        if (data.id) {
            stream.write(JSON.stringify({name: data.name, vk: data.vk}) + ', ');
        }
        bar.increment();
    });

    worker.on('exit', () => {
        delete workers[worker.threadId + 1];

        if (!workers.length > 0) {
            stream.write(']');
            stream.close();
        }
    })
}

