const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient } = require('discord.js');
const { createWriteStream } = require(`node:fs`)
const prism = require(`prism-media`);
const { pipeline } = require(`node:stream`);
const ffmpeg = require(`ffmpeg`)
const wait = require(`util`).promisify(setTimeout);
const fs = require(`fs`)
const { joinVoiceChannel, entersState, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../../schemas/userdata`)
const { Guild } = require(`../../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const { Apply } = require('../../../../schemas/applications');
const date = new Date()


module.exports = (client) => {
    client.RecordingVoiceInterview = async (interaction, isInterview) => {
        try {
            let voiceChannel
            if (!isInterview) voiceChannel = await interaction.member.voice.channel
            else voiceChannel = await interaction.guild.channels.fetch(`849607405465763861`)
            const channel = interaction.channel
            let connection = client.voiceManager.get(interaction.channel.guild.id)
            let appData = await Apply.findOne({ threadid: channel.id })
            let name
            if (isInterview && appData) name = `Interview_${appData.que2}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
            else name = `Recording_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`

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

                await interaction.channel.send(`🎙️ Теперь я записываю \`${voiceChannel.name}\``);
                receiver.speaking.on('start', (userId) => {
                    createListeningStream(receiver, userId, client.users.cache.get(userId), name);
                });
                while (connection) {
                    createListeningStream(receiver, interaction.user.id, interaction.user, name)
                }

            } else if (connection) {
                const msg = await interaction.channel.send("Пожалуйста, подождите, я готовлю вашу аудиозапись...")
                await wait(5000)

                connection.destroy();

                client.voiceManager.delete(interaction.channel.guild.id)
                const filename = `./src/files/Recordings/${name}`;

                const process = new ffmpeg(`${filename}.pcm`);
                process.then(function (audio) {
                    audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                        if (error) return console.log(error)
                        let att = new AttachmentBuilder(`./src/files/Recordings/${name}.mp3`, 'recording.mp3')
                        await msg.edit({
                            content: `🔉 Запись интервью!`,
                            files: [att]
                        });
                        if (isInterview) {
                            const thread = await interaction.guild.channels.fetch(appData.threadid)
                            await thread.send({
                                content: `Запись интервью пользователя <@${appData.userid}>!`,
                                files: [att]
                            })
                        }

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
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }
    }
}

function createListeningStream(receiver, userId, user, name) {
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
    const filename = `./src/files/Recordings/${name}.pcm`;

    const out = createWriteStream(filename, { flags: 'a' });

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`❌ Ошибка при записи ${filename} - ${err.message}`);
        } else {

        }
    });
}
