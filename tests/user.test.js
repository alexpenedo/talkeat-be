import 'babel-polyfill';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import mongoose from 'sinon-mongoose';

import User from '../models/user';

// Test will pass if the todo is saved
describe("Post a new user", function () {
    it("should create new user", function (done) {
        let UserMock = sinon.mock(new User({ "name": "test", "surname": "test", "email": "test@test.com", "mobileNumber": "666555444", "postalCode": 15004, "address": "Payo Gómez, 13 1°", "country": "España", "password": "test" }));
        let user = UserMock.object;
        let expectedResult = { status: true };
        UserMock.expects('save').yields(null, expectedResult);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the todo is not saved
    it("should return error, if post not saved", function (done) {
        let UserMock = sinon.mock(new User({ "name": "test", "surname": "test", "email": "test@test.com", "mobileNumber": "666555444", "postalCode": 15004, "address": "Payo Gómez, 13 1°", "country": "España", "password": "test" }));
        let user = UserMock.object;
        let expectedResult = { status: false };
        UserMock.expects('save').yields(expectedResult, null);
        user.save(function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});


