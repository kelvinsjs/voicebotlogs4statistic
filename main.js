const { Client, Intents } = require('discord.js-selfbot-v13');
const { guildId } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.guild.id !== guildId) return; // Проверяем, что событие произошло на нужном сервере

    const user = newState.member.user;
    const userId = user.id;
    const username = user.username;
    const timestamp = new Date().toLocaleString();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    let action, channelName, channelId;

    if (oldState.channelId === null && newState.channelId !== null) {
        // Пользователь зашел в голосовой канал
        action = 'заход';
        channelName = newState.channel.name;
        channelId = newState.channel.id;
    } else if (oldState.channelId !== null && newState.channelId === null) {
        // Пользователь вышел из голосового канала
        action = 'выход';
        channelName = oldState.channel.name;
        channelId = oldState.channel.id;
    }

    if (action) {
        const logEntry = `${userId}$$$${username}$$$${action}$$$${date}$$$${time}$$$${channelName}$$$${channelId}`;
        console.log(logEntry); // Выводим данные в консоль
        fs.appendFile(path.join(__dirname, 'voice_logs.txt'), logEntry + '\n', (err) => {
            if (err) {
                console.error('Ошибка при записи в файл:', err);
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
