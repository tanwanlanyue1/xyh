/**
 *  This is use to record media for back show media
 *  lib common to use sdk
 *  author: xyh
 *  Date: 2018/8/15 9:48
 */
window.MediaRecord = (function () {

    /**
     *  init some need params top, we need to design print.
     *  cell web rtc about API to template some record. we should to check some API support.
     *  MediaRecordBase Class governed about params and props
     *  checkSupportAPI: for some different webkit to support.
     *  get(): to get the needed to API.
     */
    class MediaRecordBase {
      constructor (mediaSource, mediaRecorder, mediaGetUserMedia) {
   
        this.checkSupportAPI({
          mediaSource: MediaSource,
          mediaRecorder: MediaRecorder,
          mediaGetUserMedia: navigator.mediaDevices.getUserMedia // webkit 
        });
   
        this.mediaSource = mediaSource;
        this.mediaRecorder = mediaRecorder;
        this.mediaGetUserMedia = mediaGetUserMedia;
      }
   
      checkSupportAPI (mediaAPI) {
        for (let key in mediaAPI) {
          if (mediaAPI.hasOwnProperty(key)) {
            if (typeof mediaAPI[key] === 'function') {
              return true;
            } else {
              new Error(`${key}` + 'is not your brower not support! need to support!');
            }
          }
        }
      }
   
      get (mediaAPI) {
        if (typeof mediaAPI === 'function') return mediaAPI;
      }
    }
   
    /**
     * create class MediaRecordBo to governed some props
     *  recodedBlobs
     *  sourceBuffer
     *  recordVideo
     *  recordedButton: operator button.
     *
     */
   
    class MediaRecordBo extends MediaRecordBase {
      constructor (mediaSource, mediaRecorder, mediaGetUserMedia, options) {
        super (mediaSource, mediaRecorder, mediaGetUserMedia);
        this.recodedBlobs = options.recodedBlobs;
        this.sourceBuffer = options.sourceBuffer;
        this.startRecordFlag = options.startRecordFlag;
        this.endRecordFlag = options.endRecordFlag;
      }
    }
   
    /**
     *  mediaRecordBiz class governed to function and operator
     *  mediaStartRecord()
     *  mediaPlayRecord()
     *  mediaStopRecord()
     *  mediaPlayGetUrl()
     *  mediaCheckOriginSecure()
     *  init()
     */
   
    class MediaRecordBiz extends MediaRecordBase {
      constructor (mediaSource, mediaRecorder, mediaGetUserMedia, options) {
        super(mediaSource, mediaRecorder, mediaGetUserMedia);
        this.mimeType = options.mimeType;
        this.mediaBoClass = options.mediaBoClass;
      }
   
      mediaStartRecord () {
        try {
          this.mediaRecorder.onstop = function (event) {
          }
          let that = this;
          this.mediaRecorder.ondataavailable = function (event) {
            if (event.data && event.data.size > 0) {
              that.mediaBoClass.recodedBlobs.push(event.data);
            }
          };
          that.mediaRecorder.start(10);
          this.mediaBoClass.startRecordFlag = true;
        } catch (e) {
          console.log(e, 'error start Record');
        }
   
      }
   
      mediaStopRecord (videoDom) {
        if (this.mediaBoClass.startRecordFlag) {
        this.mediaRecorder.stop();
        videoDom.controls = true;
        this.mediaBoClass.endRecordFlag = true;
        this.mediaBoClass.startRecordFlag = false;
        return this.mediaBoClass.recodedBlobs;
      }
      }
   
      mediaPlayRecord (videoDom) {
        if (this.mediaBoClass.endRecordFlag) {
        this.mediaBoClass.sourceBuffer = new Blob(this.mediaBoClass.recodedBlobs, {type: this.mimeType});
        videoDom.src = window.URL.createObjectURL(this.mediaBoClass.sourceBuffer);
   
        videoDom.addEventListener('loadedmetadata', () => {
          if (videoDom.duration === Infinity) {
            this.mediaBoClass.currentTime = 1e101;
              videoDom.ontimeupdate = function () {
              videoDom.currentTime = 0;
              videoDom.ontimeupdate = function() {
                delete videoDom.ontimeupdate;
                videoDom.play();
              };
            };
          } else {
            videoDom.play();
          }
        });
      }
      }
   
      mediaPlayGetUrl () {
        return window.URL.createObjectURL(this.mediaBoClass.sourceBuffer);
      }
      handleSourceOpen () {
        this.mediaBoClass.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);
      }
    }
   
    function init (videoDom, callback) {
      /**
       * check the origin secure for https or localhost.
       * plase to open server host local.
       */
      window.streamData = null;
      mediaCheckOriginSecure();
      initUserMedia(videoDom, callback);
    }
   
    /**
     * async quest stream use navigator.mediaDevices.getUserMedia
     * @param {*} videoDom 
     * @param {*} callback 
     * @returns {*}
     */
    async function initUserMedia (videoDom, callback) {
      let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      _initAPI(stream, videoDom, callback);
    }
   
    function mediaCheckOriginSecure () {
      try {
        if (location.protocol !== 'https:' || location.hostname !== 'localhost') {
          new Error(`${location.protocol || location.hostname}` + 'getUserMedia() must be run from a secure origin: HTTPS or localhost.\n\nChanging protocol to HTTPS');
        }
      } catch (e) {
        location.protocol = 'HTTPS';
      }
    }
   
    function _initAPI (stream, videoDom, callback) {
      let mimeType = null;
      window.streamData = stream;
   
      /**
       * check type to some video webm
       * @type {{mediaSource: MediaSource, mediaRecorder: MediaRecorder, mediaGetUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>, mimeTypeGroup: string[]}}
       */
      const mimeTypeGroup = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm;codecs=h264',
        'video/webm'
      ];
   
      if (typeof MediaRecorder === 'function') {
        mimeTypeGroup.map((item) => {
          if (MediaRecorder.isTypeSupported(item)) {
            mimeType = item;
          }
        });
      }
   
      const COMMON_API = {
        mediaSource: new MediaSource(),
        mediaRecorder: new MediaRecorder(stream, {mimeType: mimeType}), // TODO：MediaRecorder params to steamData
        mediaGetUserMedia: navigator.mediaDevices.getUserMedia
      }
   
      const mediaRecordBase = new MediaRecordBase(COMMON_API.mediaSource, COMMON_API.mediaRecorder, COMMON_API.mediaGetUserMedia);
      const mediaRecordBo = new MediaRecordBo(COMMON_API.mediaSource, COMMON_API.mediaRecorder, COMMON_API.mediaGetUserMedia,{
        recodedBlobs: [],
        sourceBuffer: null,
        recordVideo: null,
        startRecordFlag: false,
        endRecordFlag: false
      });
   
      const mediaRecordBiz = new MediaRecordBiz(COMMON_API.mediaSource, COMMON_API.mediaRecorder, COMMON_API.mediaGetUserMedia, {
        mimeType: mimeType,
        mediaBoClass: mediaRecordBo
      });
   
      const RecorderAPI = {
        mediaRecordBase,
        mediaRecordBo,
        mediaRecordBiz,
      }
   
      videoDom.srcObject = stream;
      typeof callback === 'function' && callback(RecorderAPI);
    }
   
    return {
      init,
    }
   
   }());

   
   