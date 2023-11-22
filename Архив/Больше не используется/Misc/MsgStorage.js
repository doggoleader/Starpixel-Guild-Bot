const { MsgData } = require(`../../../src/schemas/msgdata`)
const chalk = require(`chalk`)

module.exports = (client) => {
    client.msgdata = async () => {
        setInterval(async () => {
            const results = await MsgData.find({ messages: {
                expire: { $lt: new Date() }
            }})

            const to_remove = results.filter(item => item.messages.expire < Date.now() )
            
        }, 10000)
    }
}