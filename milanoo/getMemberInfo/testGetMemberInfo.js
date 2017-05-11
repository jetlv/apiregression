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
const spreadSheetName = __dirname + '/testGetMemberInfo.xlsx';
const apiPath = ref.config._hostAddress + '/sp/member/getMemberInfo.htm';


describe('testGetMemberInfo', function () {

    describe('testGetMemberInfo-会员信息获取', function () {
        //上下文
        let ctx = {};

        /** 该接口测试前置操作*/
        before(function (done) {
            //随机邮箱字符串
            let randomString = stringtool.randomStr(8);
            let externalApiLink = 'http://192.168.11.67:8080/sp/member/memberRegister.htm?member.email=' + randomString + '@milanoo.com&member.userPass=123456&member.lang=en-uk'
            externalApiGet(externalApiLink).then(function (result) {
                let memberId = result.id;
                ctx.memberId = memberId;
                let rows = [['id'], [memberId]];
                let sheet = {name: 'general', data: rows};
                buildSheet([sheet], spreadSheetName);
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
                console.log(sheet.name);
                if (sheet.name == testName) {
                    ctx.paramArray = sheetToObjectArr(sheet.data);
                    found = true;
                }
            });
            //如果没能找到对应的参数表，则抛出异常
            expect(found, '无法找到对应的参数表格').to.be.true;
        });


        //常规验证
        it('general', function (done) {
            Promise.mapSeries(ctx.paramArray, function (paramObj) {
                let params = querystring.stringify(paramObj);
                let fullPath = apiPath + '?' + params;
                let reqOpt = {
                    uri: fullPath,
                    method: 'GET',
                    gzip: true,
                    json: true
                };
                return rp(reqOpt).then(function (result) {
                    expect(result.code).equal('0');
                    expect(result.member.MemberId).equal(parseInt(ctx.memberId));
                    expect(result.member.MemberUserState).equal(0);
                    expect(result.member.MemberType).equal('Personal');
                }).then(done).catch(function (err) {
                    done(fullPath + ' - ' + err);
                });
            }).catch(function (err) {
                done(err);
            });
        });
    });
});