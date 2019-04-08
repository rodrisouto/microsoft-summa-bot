// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const exec = require('child_process').execSync;
const fs = require('fs');

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            fs.writeFileSync("temp", `${turnContext.activity.text}`, () => {});
            let output = exec(`textrank -t temp`, (err, stdout, stderr) => {
                if (err) {
                    console.log("Couldn't execute command.");
                    console.log(`stdout: ${ stdout }`);
                    console.log(`stderr: ${ stderr }`);
                }
            });
            await turnContext.sendActivity(`${ output }`);
            fs.unlinkSync("temp")
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
