# Media-Record-plugin

media record user for project.
webpack plugin to server. so you need to use webpack for open project.
plase come to webpack course.

## use webpack

```js
    npm install
    npm run build
    npm run dev
```

## first you should be `http://localhost` or open server. In the plugin, you can use webpack open the localhost. default host `9090`, if your host is common, you can change the host use of `webpack.config.js` in the project

```js
    npm run dev
```

## use plugin handle

```js
    // init params for neened
    let commonAPI = null;
    let videoDom = document.getElementById('myVideo');

    // init MediaRecord
     MediaRecord.init(vieoDom, (API) => {
        commonAPI = API.mediaRecordBiz;
    });

    // start record to use commonAPI.mediaStartRecord

    startButton.addEventListener('click', () => {
        commonAPI.mediaStartRecord();
    }, false);

    // stop record to use commonAPI.mediaStopRecord(videoDom)
    // mediaStopRecord need to use videoDom for params
    stopButton.addEventListener('click', () => {
        commonAPI.mediaStopRecord(videoDom);
    },false);

```

### use test model

support test to run model for about offer API. so you can run test file and show result.
