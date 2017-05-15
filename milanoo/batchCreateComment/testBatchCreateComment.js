let ref = require('../../REF');

/** 依赖和配置*/
const fs = ref.fs;
const querystring = ref.querystring;
const Promise = ref.blubird;
const expect = ref.expect;
const xlsx = ref.xlsx;
const rp = ref.rp;
const mysql = ref.mysql;
const stringtool = ref.stringtool;
const buildSheet = ref.buildSheet;
const externalApiGet = ref.externalApiGet;
const sheetToObjectArr = ref.sheetToObjectArr;


describe('batchCreateComment', function () {

    describe('batchCreateComment - 基本验证', function () {
        //上下文
        let ctx = {};

        /** 该接口测试前置操作*/
        before(function () {
        });

        /** 每一具体case的前置操作 */
        beforeEach(function () {
        });


        //常规验证
        it('general', async() => {
            let generalReq = () => {
                let fullPath = 'http://192.168.11.67:8080/products/productComment/batchCreateComment.htm?json=[{"productScore":5,"userIp":"172.0.0.1","memberEmail":"abc@mialnoo.com","commentPictureUrlArr":"[\'2015/201503/20150320/352A7C987F0000014CF15AA5CFDCC98E.jpg|||test|||this%20is%20a%20pic%20content\',\'2015/201503/20150320/352A7C5C7F0000011CEF252AB259D7BA.jpg\']","commentTitle":"this%20is%20a%20title","userCountry":"CN","commentContent":"this%20is%20a%20test%20for%20content","memberName":"CB","productId":2917,"languageCode":"cn-cn",%20"websiteId":9,"memberId":0}]'
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then((result) => {
                    expect(result.code, fullPath + ' - 基本返回状态码不对, 实际返回 - ' + JSON.stringify(result)).equal('0');
                }).catch(err => {
                    expect(false, fullPath + ' - ' + err).equal(true);
                })
            }
            await generalReq();
        });
    });
});