import { Client, Intents } from 'discord.js-selfbot-v13';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    await sendLogsToUser();
});

async function sendLogsToUser() {
    const targetUserId = process.env.TARGET_USER_ID;
    if (!targetUserId) {
        console.error('TARGET_USER_ID is not set in environment variables.');
        return;
    }

    const filePath = path.join(__dirname, 'voice_logs.txt');

    try {
        const user = await client.users.fetch(targetUserId);
        await user.send({
            content: 'Логи голосовых каналов:',
            files: [{
                attachment: filePath,
                name: 'voice_logs.txt'
            }]
        });
        console.log('Файл успешно отправлен пользователю.');
    } catch (err) {
        console.error('Ошибка при отправке сообщения:', err);
    }
}

client.login(process.env.DISCORD_TOKEN);
