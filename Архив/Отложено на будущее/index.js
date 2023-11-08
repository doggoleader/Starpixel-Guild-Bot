require('dotenv').config();
const { ShardingManager } = require(`discord.js`)
const chalk = require(`chalk`)

let manager = new ShardingManager('./src/bot.js', {
    token: process.env.token,
    totalShards: `auto`,
    shardList: 'auto'
})

manager.on('shardCreate', shard => {
    console.log(chalk.blue(`[SHARDS]` + chalk.white(`: Был создан Shard ${shard.id}!`)))
})

manager.spawn()