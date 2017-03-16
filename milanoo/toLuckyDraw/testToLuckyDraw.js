let ref = require('../../REF');
//"本文件包含三个接口的测试，即需求40184上的三个。这三个接口形成严重的依赖，无法单独测试";

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
const spreadSheetName = 'testToLuckyDraw.xlsx';
const apiPath_toLuckyDraw = ref.config._hostAddress + '/promotion/easter/toLuckyDraw.htm';  //抽奖接口
const apiPath_saveShare = ref.config._hostAddress + '/promotion/anniversary/saveShare.htm'; //分享接口
const apiPath_getWinningCount = ref.config._hostAddress + '/promotion/easter/getWinningCount.htm'; //结果列表


describe('testToLuckyDraw', function () {

    describe('复活节抽奖+分享+查询流程测试', function () {
        //全局上下文
        let ctx = {};
        ctx.awardTypeArray = [];

        /** 该接口测试前置操作*/
        before(function (done) {
            //随机邮箱字符串
            let randomString = stringtool.randomStr(8);
            //注册一个新用户
            let externalApiLink = 'http://192.168.11.67:8080/sp/member/memberRegister.htm?member.email=' + randomString + '@milanoo.com&member.userPass=123456&member.lang=en-uk'
            externalApiGet(externalApiLink).then(function (result) {
                //获取用户ID
                let memberId = result.id;
                ctx.memberId = memberId;
                //抽奖接口数据表格构造
                let rows_toLuckyDraw = [['memberId', 'languageCode', 'deviceType'], [memberId, 'en-uk', '1'], [memberId, 'en-uk', '1'], [memberId, 'en-uk', '1']];
                let sheet_toLuckyDraw = {name: 'toLuckyDraw', data: rows_toLuckyDraw};

                //分享接口数据表格构造
                let rows_saveShare = [['memberId'], [memberId]];
                let sheet_saveShare = {name: 'saveShare', data: rows_saveShare};

                //查询列表接口数据表格构造
                let rows_getWinningCount = [['memberId', 'languageCode'], [memberId, 'en-uk']];
                let sheet_getWinningCount = {name: 'getWinningCount', data: rows_getWinningCount};

                //第四次抽奖数据表格构造
                let rows_toLuckyDraw_fourth = [['memberId', 'languageCode', 'deviceType'], [memberId, 'en-uk', '1']];
                let sheet_toLuckyDraw_fourth = {name: 'toLuckyDraw_fourth', data: rows_toLuckyDraw_fourth};

                //第五次抽奖数据表格构造
                let rows_toLuckyDraw_fifth = [['memberId', 'languageCode', 'deviceType'], [memberId, 'en-uk', '1']];
                let sheet_toLuckyDraw_fifth = {name: 'toLuckyDraw_fifth', data: rows_toLuckyDraw_fifth};

                buildSheet([sheet_toLuckyDraw, sheet_saveShare, sheet_getWinningCount, sheet_toLuckyDraw_fourth, sheet_toLuckyDraw_fifth], spreadSheetName);
                done();
                return 0;
            }).catch(function (err) {
                done('构造表格时出错 - ' + err);
            });
        });

        /** 每一具体case的前置操作 */
        beforeEach(function () {
            let spreadSheets = xlsx.parse(fs.readFileSync(spreadSheetName));
            //获取测试名称，以便和表格进行对应
            let testName = this.currentTest.title;
            let found = false;
            spreadSheets.forEach(function (sheet, index, array) {
                if (sheet.name == testName) {
                    ctx.paramArray = sheetToObjectArr(sheet.data);
                    found = true;
                }
            });
            //如果没能找到对应的参数表，则抛出异常
            expect(found, 'Unable to found param sheet').to.be.true;
        });

        it('toLuckyDraw', function (done) {
            //抽奖三次
            return Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_toLuckyDraw + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).to.equal('0');
                    expect(result.flag, '前三次抽奖出现问题').equal(0);
                    expect(((result.awardType > 0) && (result.awardType < 9)), '奖品类型不对').to.be.true;
                    //放入抽中的记录中
                    ctx.awardTypeArray.push(result.awardType);
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('toLuckyDraw_fourth', function (done) {
            //第四次抽奖
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_toLuckyDraw + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).to.equal('0');
                    expect(result.flag, '第四次抽奖返回的flag不正确').equal(2);
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('saveShare', function (done) {
            //分享
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_saveShare + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).equal('0');
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('toLuckyDraw_fourth', function (done) {
            //再次进行第四次抽奖
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_toLuckyDraw + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).to.equal('0');
                    expect(result.flag, '分享后第四次抽奖返回的flag不正确').equal(0);
                    expect(((result.awardType > 0) && (result.awardType < 9)), '奖品类型不对').to.be.true;
                    ctx.awardTypeArray.push(result.awardType);
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('toLuckyDraw_fifth', function (done) {
            //第五次抽奖
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_toLuckyDraw + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).to.equal('0');
                    expect(result.flag, '第五次抽奖返回的flag不正确').equal(1);
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('getWinningCount', function (done) {
            //列表查询
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath_getWinningCount + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).to.equal('0');
                    result.list.forEach(function (item, index, array) {
                        expect(ctx.awardTypeArray.indexOf(item.awardType), '查询到的抽奖结果有误 - ' + result).to.not.equal(-1);
                    });
                }).catch(function (err) {
                    expect(false, fullPath + ' - ' + err).to.be.true;
                });
            }).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });

    });


    describe('抽奖接口逻辑测试', function () {
        let ctx = {};
    });

})