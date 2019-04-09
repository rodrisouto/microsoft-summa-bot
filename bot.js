// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const exec = require('child_process').execSync;
const fs = require('fs');
const wtf = require('wtf_wikipedia');

let TMP_FILE_FOR_SUMMA_API = 'temp';

class SummaBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {

            var wikiText = await this.getTextFromWikipedia(`${ turnContext.activity.text }`);
            await this.sendSummaText(turnContext, wikiText);

        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    async getTextFromWikipedia(title) {

        return (async () => {
            var doc = await wtf.fetch(`${ title }`);
            return await doc.text();
        })();
    }

    async sendSummaText(turnContext, text) {

        fs.writeFileSync(TMP_FILE_FOR_SUMMA_API, `${ text }`, () => {
        });
        let output = exec(`textrank -t temp -w 200`, (err, stdout, stderr) => {
            if (err) {
                console.log("Couldn't execute command.");
                console.log(`stdout: ${ stdout }`);
                console.log(`stderr: ${ stderr }`);
            }
        });
        await turnContext.sendActivity(`${ output }`);
        fs.unlinkSync(TMP_FILE_FOR_SUMMA_API);
    }
}

module.exports.SummaBot = SummaBot;

/*
var doc = wtf.fetch('Toronto');
console.log(doc.text());
*/
