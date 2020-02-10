const {parentPort, workerData} = require('worker_threads');
const client = require('./modules/axios');
const cheerio = require('cheerio');

const e = async () => {
    parentPort.postMessage('Worker ' + workerData.id + ' started');

    for (let i = workerData.start; i <= workerData.end; i++) {
        try {
            const res = await client.get('/users/' + i);
            if (res.status === 200) {
                const $ = cheerio.load(res.data);
                const name = $('.m-small-title').text();
                let vk = false;

                $('.no-margin-bottom > li > a').each((k, element) => {
                    const href = $(element).attr('href');
                    if (href.match(/https:\/\/vk\.com\//g)) {
                        vk = href;
                    }
                });

                if (vk) {
                    parentPort.postMessage({id: i, name: name, vk: vk});
                } else {
                    parentPort.postMessage('');
                }
            }
        } catch (e) {
            parentPort.postMessage(e);
        }
    }
};


e().then(() => {
    parentPort.close();
});