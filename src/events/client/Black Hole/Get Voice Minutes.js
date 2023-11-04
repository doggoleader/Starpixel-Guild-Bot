const chalk = require(`chalk`);
const { EmbedBuilder } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`);
const { User } = require("../../../schemas/userdata");
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'voiceStateUpdate',
    plugin: {
        id: "admin",
        name: "Административное"
    },
    async execute(oldMember, newMember, client) {
        if (!await checkPlugin(newMember.guild.id, this.plugin.id)) return
        if (oldMember.member.user.bot || newMember.member.user.bot) return
        if (!newMember.member.roles.cache.has(`504887113649750016`)) return
        const userData = await User.findOne({
            userid: newMember.member.user.id
        })

        //Проверка канала
        if (oldMember?.channel?.id == newMember?.channel?.id) { //Остался в канале
            //Разговор
            if (oldMember.mute == true && newMember.mute == false) {
                const timestampStart = Number(Date.now())
                userData.black_hole.info.startedTalk = timestampStart
                userData.save()
            } else if (oldMember.mute == false && newMember.mute == true) {
                const timestampEnd = Number(Date.now())
                const timestampStart = userData.black_hole.info.startedTalk
                let mins = Math.round((timestampEnd - timestampStart) / (1000))
                userData.black_hole.info.minutesInVoiceTalking_lastMonth += mins
                userData.save()
            }

            /* console.log(`Остался в канале
${userData.black_hole.info.joinedVoice} - Присоединился к голосовому
${userData.black_hole.info.startedTalk} - Начало разговора
${userData.black_hole.info.minutesInVoice_lastMonth} - Секунды в голосовом
${userData.black_hole.info.minutesInVoiceTalking_lastMonth} - Секунды разговора
-----------------------------`) */
        } else if (oldMember?.channel?.id !== newMember?.channel?.id) {
            if (!oldMember?.channel?.id && newMember?.channel?.id) { //Присоединился к каналу
                //Присоединение
                const joinedChannel = Number(Date.now())
                userData.black_hole.info.joinedVoice = joinedChannel

                //Разговор
                if (newMember.mute == false) {
                    const timestampStart = Number(Date.now())
                    userData.black_hole.info.startedTalk = timestampStart
                }
                userData.save()
                /* console.log(`Присоединился к каналу
${userData.black_hole.info.joinedVoice} - Присоединился к голосовому
${userData.black_hole.info.startedTalk} - Начало разговора
${userData.black_hole.info.minutesInVoice_lastMonth} - Секунды в голосовом
${userData.black_hole.info.minutesInVoiceTalking_lastMonth} - Секунды разговора
-----------------------------`) */
            } else if (oldMember?.channel?.id && newMember?.channel?.id) { //Поменялся канал

                //Разговор
                if (oldMember.mute == true && newMember.mute == false) {
                    const timestampStart = Number(Date.now())
                    userData.black_hole.info.startedTalk = timestampStart
                    userData.save()
                } else if (oldMember.mute == false && newMember.mute == true) {
                    const timestampEnd = Number(Date.now())
                    const timestampStart = userData.black_hole.info.startedTalk
                    let mins = Math.round((timestampEnd - timestampStart) / (1000))
                    userData.black_hole.info.minutesInVoiceTalking_lastMonth += mins
                    userData.save()
                }
                /* console.log(`Поменялся канал
${userData.black_hole.info.joinedVoice} - Присоединился к голосовому
${userData.black_hole.info.startedTalk} - Начало разговора
${userData.black_hole.info.minutesInVoice_lastMonth} - Секунды в голосовом
${userData.black_hole.info.minutesInVoiceTalking_lastMonth} - Секунды разговора
-----------------------------`) */

            } else if (oldMember?.channel?.id && !newMember?.channel?.id) {//Покинул канал
                //Отключение
                const leftChannel = Number(Date.now())
                const joinedChannel = userData.black_hole.info.joinedVoice
                let minsIn = Math.round((leftChannel - joinedChannel) / (1000))
                userData.black_hole.info.minutesInVoice_lastMonth += minsIn

                //Разговор
                if (oldMember.mute == false) {
                    const timestampEnd = Number(Date.now())
                    const timestampStart = userData.black_hole.info.startedTalk
                    let mins = Math.round((timestampEnd - timestampStart) / (1000))
                    userData.black_hole.info.minutesInVoiceTalking_lastMonth += mins
                }
                userData.save()

                /* console.log(`Покинул канал
${userData.black_hole.info.joinedVoice} - Присоединился к голосовому
${userData.black_hole.info.startedTalk} - Начало разговора
${userData.black_hole.info.minutesInVoice_lastMonth} - Секунды в голосовом
${userData.black_hole.info.minutesInVoiceTalking_lastMonth} - Секунды разговора
-----------------------------`) */
            } else if (!oldMember?.channel?.id && !newMember?.channel?.id) {//??? (нет ни старого, ни нового канала)

                //Разговор
                if (oldMember.mute == true && newMember.mute == false) {
                    const timestampStart = Number(Date.now())
                    userData.black_hole.info.startedTalk = timestampStart
                    userData.save()
                } else if (oldMember.mute == false && newMember.mute == true) {
                    const timestampEnd = Number(Date.now())
                    const timestampStart = userData.black_hole.info.startedTalk
                    let mins = Math.round((timestampEnd - timestampStart) / (1000))
                    userData.black_hole.info.minutesInVoiceTalking_lastMonth += mins
                    userData.save()
                }
                /* console.log(`Нет ни старого, ни нового канала
${userData.black_hole.info.joinedVoice} - Присоединился к голосовому
${userData.black_hole.info.startedTalk} - Начало разговора
${userData.black_hole.info.minutesInVoice_lastMonth} - Секунды в голосовом
${userData.black_hole.info.minutesInVoiceTalking_lastMonth} - Секунды разговора
-----------------------------`) */
            }
        }
    }
}