/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Account extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const user = [
            {
                email: '',
                identity: ''
            }
        ];

        for (let i = 0; i < user.length; i++) {
            user[i].docType = 'user';
            await ctx.stub.putState('Account' + i, Buffer.from(JSON.stringify(user[i])));
            console.info('Added <--> ', user[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryAccount(ctx, userNumber) {
        const userAsBytes = await ctx.stub.getState(userNumber);

        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createAccount(ctx, userNumber, email, identity) {
        console.info('============= START : Create Account ===========');

        const user = {
            email,
            identity
        }

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create Account ===========');
    }

    async queryAllAccounts(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


}

module.exports = Account;
