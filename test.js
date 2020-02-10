const {parentPort, workerData} = require('worker_threads');
const axios = require('axios');
const cheerio = require('cheerio');

const client = axios.create({baseURL: process.env.BASE_URI});

try {
    client.get('/users/' + workerData).then((res) => {
        if (res.status === 200) {
            const $ = cheerio.load(res.data);
            const name = $('.m-small-title').text();
            const vk = $('#yw2 > li:nth-child(4) > a').attr('href');
            if (vk) {
                parentPort.postMessage({"name": name, "vk": vk});
                console.log('Save ' + i + ' of ' + process.env.LIMIT + ': ' + name);
            } else {
                console.log(i + ' of ' + process.env.LIMIT + ': VK link not founded');
            }
        }
    })

} catch (e) {
    console.log('Error get ' + workerData)
}