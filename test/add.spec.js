import MediaRecord from './add.js';
import { expect } from 'chai';
import  jasmine  from 'karma-jasmine';

describe("MediaRecord is test type", () => {
    it("MediaRecord.init test type", () => {
        expect(window).to.have.any.keys('MediaRecord');
        var init = MediaRecord.init;
        expect(init).is.be.to.exist;
        expect(init).to.be.an("function");
    });
});

describe('MediaRecord has about function test', () => {
    const dom = Object.create(null); // 参数必须是object类型的

    function handlePromise () {
        let myPromise = new Promise(function (resolve, reject) {
            MediaRecord.init(dom, function (API) {
                resolve(API);
            });
        });

        return myPromise;
    }

    it('MediaRecord.init about function run is not current', function (done) {
        handlePromise().then(res => {
            expect(res).to.be.an('object');
            done();
        })
    });

    describe("timeout 5000m to run ", function() {
        var originalTimeout;
        beforeEach(function() {
            window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
 
        it("takes a long time", function(done) {
            setTimeout(function() {
                done();
            }, 5000);
        });
 
        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
    });
});

