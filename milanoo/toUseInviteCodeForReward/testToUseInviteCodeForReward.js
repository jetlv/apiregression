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


describe('toUseInviteCodeForReward', function () {

    describe('toUseInviteCodeForReward - 基本验证', function () {
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
                let fullPath = 'http://192.168.11.67:8080/member/member/toUseInviteCodeForReward.htm?memberId=123&inviteCode=EBDE12D'
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