import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';
import {userBuilder} from "./test-builders";
import TestRunner from "./test-runner";

export async function getToken(user?) {
    if (!user) {
        user = await userBuilder().withValidData().store();
    }
    const jwtSecret = TestRunner.config.jwtSecret;
    return await jwt.sign({_id: user._id, email: user.email,}, jwtSecret);
}

//UTILS
export async function clearDatabase() {
    const config = TestRunner.config;
    await mongoose.connect(`${config.mongoHost}/${config.mongoSchema}`, {useNewUrlParser: true});
    await mongoose.connection.collection('users').remove({});
    await mongoose.connection.collection('menus').remove({});
    await mongoose.connection.collection('bookings').remove({});
    await mongoose.connection.collection('rates').remove({});
    await mongoose.connection.collection('chats').remove({});
}