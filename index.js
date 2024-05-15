// require('dotenv/config');
require('dotenv').config();

// const { Client } = require('discord.js');
// const {OpenAI} = require('openai');

// const client = new Client({
//     intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'], 
// });



const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI, Configuration } = require('openai');

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
// this makes a new instance of the client class 

//event listener
client.on('ready', () => {
    console.log('The bot is online');
});

const IGNORE_PREFIX = "!"; 
const CHANNLES = ['1240162421465677855'];

const openAI = new OpenAI({
    apiKey: process.env.OPENAI_KEY, 
});


//listen to messages on discord 
client.on('messageCreate', async (message) => {
    //now we check if the message was sent by a bot
    //msg = message.content; 
    if(message.author.bot) return; 
    if(message.content.startsWith(IGNORE_PREFIX)) return; 
    // now to check if the message was sent in the correct channel 
    if(!CHANNLES.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return; 
    
     // now we can respond to the message 
     // by sending a request to openAI
    const response = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo', 
        messages:  [
            {
            //name: 
                role: 'system', 
                content: 'Chat GPT is a friendly chatbot.',
            }, 

            {
                role: 'user', 
                content: message.content, 
            }
        ]
    }).catch((error) => console.error('OpenAi Error:\n', error));

    message.reply(response.choices[0].message.content.substring(0,2000));

});


// this logins to our bot 
client.login(process.env.TOKEN);
