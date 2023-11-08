if(userData.rank >= 50) {
    const oldrank = `553593731953983498`
    const newrank = `553593734479216661`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 150) {
    const oldrank = `553593734479216661`
    const newrank = `553593136895623208`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 500) {
    const oldrank = `553593136895623208`
    const newrank = `553593133884112900`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 1000) {
    const oldrank = `553593133884112900`
    const newrank = `553593136027533313`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 1500) {
    const oldrank = `553593136027533313`
    const newrank = `553593976037310489`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 2500) {
    const oldrank = `553593976037310489`
    const newrank = `780487593485008946`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 5000) {
    const newrank = `849695880688173087`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 10000 && user.cache.has (`930520087797051452`)) {
    const oldrank = [`780487593485008946`,`849695880688173087`]
    const newrank = `992122876394225814`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 15000 && user.cache.has (`930520087797051452`)) {
    const newrank = `992123014831419472`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
} else if(userData.rank >= 25000 && user.cache.has (`930520087797051452`)) {
    const oldrank = `992123014831419472`
    const newrank = `992123019793276961`
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${interaction.guild.roles.cache.get(newrank).name}.`))
    user.roles.remove(oldrank).catch(console.error)
    user.roles.add(newrank).catch(console.error)
    interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}!`)
}