const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient } = require('discord.js');
const { createWriteStream } = require(`node:fs`)
const prism = require(`prism-media`);
const { pipeline } = require(`node:stream`);
const ffmpeg = require(`ffmpeg`)
const sleep = require(`util`).promisify(setTimeout);
const fs = require(`fs`)
const { joinVoiceChannel, entersState, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const { execute } = require('../../src/events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../src/schemas/userdata`)
const { Guild } = require(`../../src/schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const date = new Date()

module.exports = {
    category: ``,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`record`)
        .setDescription(`Начать запись разговора`),

    async execute(interaction, client) {
        try {

            
            const voiceChannel = interaction.member.voice.channel
            let connection = client.voiceManager.get(interaction.channel.guild.id)

            if (!connection) {
                if (!voiceChannel) return interaction.followUp({
                    content: "Вы должны быть в голосовом канале, чтобы использовать эту команду!",
                    ephemeral: true

                })

                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    selfDeaf: false,
                    selfMute: true,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                client.voiceManager.set(interaction.channel.guild.id, connection);
                await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
                const receiver = connection.receiver;

                receiver.speaking.on('start', (userId) => {
                    createListeningStream(receiver, userId, client.users.cache.get(userId));
                });

                return interaction.channel.send(`🎙️ Теперь я записываю \`${voiceChannel.name}\``);

            } else if (connection) {
                const msg = await interaction.channel.send("Пожалуйста, подождите, я готовлю вашу аудиозапись...")
                await sleep(5000)

                connection.destroy();

                client.voiceManager.delete(interaction.channel.guild.id)
                const file_date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
                const filename = `./src/files/Recordings/${file_date}`;

                const process = new ffmpeg(`${filename}.pcm`);
                process.then(function (audio) {
                    audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                        if (error) return console.log(error)
                        await msg.edit({
                            content: `🔉 Вот ваша запись!!`,
                            files: [new AttachmentBuilder(`./src/files/Recordings/${file_date}.mp3`, 'recording.mp3')]
                        });

                        fs.unlinkSync(`${filename}.pcm`)
                        fs.unlinkSync(`${filename}.mp3`)
                    });
                }, function (err) {
                    return msg.edit(`❌ Произошла ошибка при записи вашего очаровательного голоса: ${err.message}`);
                });

            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }
    }
};

function createListeningStream(receiver, userId, user) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });
    const file_date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
    const filename = `./src/files/Recordings/${file_date}.pcm`;

    const out = createWriteStream(filename, { flags: 'a' });
    console.log(chalk.blackBright(`[${new Date()}]`) + `👂 Я записываю ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`❌ Ошибка при записи ${filename} - ${err.message}`);
        } else {

        }
    });
}