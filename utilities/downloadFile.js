const download = require('download-file');
const uuid = require('uuid');
const path = require('path');


const downloadFile = async (url) => {
    return new Promise((resolve, reject) => {
        try {

            let urlData = url.split('/');
            urlData = urlData[urlData.length - 1];
            urlData = urlData.split('.');
            let extension = urlData[urlData.length - 1];
            let filename = uuid.v4() + '.' + extension;

            var options = {
                directory: path.resolve(__dirname, '../_temp'),
                filename: filename
            };

            download(url, options, function (err) {
                if (err) {
                    console.error(err);
                   reject(err);
                   return;
                }
                resolve({path : path.resolve(__dirname, '../_temp') + '/' + filename })
            })
        } catch (e) {
            console.error(e);
            return false
        }

    });
};


module.exports = {
    downloadFile
};
