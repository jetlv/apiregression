let chai = require('chai').expect;

describe('hooks', function () {

    before(function () {
        // runs before all tests in this block
        console.log('before ALL');
    });

    after(function () {
        // runs after all tests in this block
        console.log('after ALL');
    });

    beforeEach(function () {
        // runs before each test in this block
        console.log('before ' + this.currentTest.title)
    });

    afterEach(function () {
        // runs after each test in this block
        console.log('after' + this.currentTest.title)
    });


    it('case 1 is running', function (done) {
        console.log('case 1 is running')
        done();
    });
    it('case 2 is running', function (done) {
        console.log('case 1 is running')
        done();
    });
});