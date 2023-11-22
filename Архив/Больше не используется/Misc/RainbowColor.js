setInterval(async () => {
    const role = await interaction.guild.roles.fetch(`1034043261960077393`)
    const hex = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `A`, `B`, `C`, `D`, `E`, `F`,]
    let n1 = hex[Math.floor(Math.random() * hex.length)]
    let n2 = hex[Math.floor(Math.random() * hex.length)]
    let n3 = hex[Math.floor(Math.random() * hex.length)]
    let n4 = hex[Math.floor(Math.random() * hex.length)]
    let n5 = hex[Math.floor(Math.random() * hex.length)]
    let n6 = hex[Math.floor(Math.random() * hex.length)]
    let color = `#${n1}${n2}${n3}${n4}${n5}${n6}`
    await role.setColor(color)
}, 1)
await interaction.followUp({
    content: `У ${interaction.member} теперь цвет никнейма меняется!`
}) 