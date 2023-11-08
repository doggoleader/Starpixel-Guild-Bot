//Повелитель
const r11 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && member.roles.cache.has(`992123019793276961`) && member.roles.cache.has(`992122876394225814`))
await r11.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r11_list = await r11.map(async (r11s) => {
    const userData = await User.findOne({ userid: r11s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r11s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r11_res = await Promise.all(r11_list)

//Император
const r10 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && member.roles.cache.has(`992123014831419472`) && member.roles.cache.has(`992122876394225814`))
await r10.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r10_list = await r10.map(async (r10s) => {
    const userData = await User.findOne({ userid: r10s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r10s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r10_res = await Promise.all(r10_list)

//Лорд
const r9 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && member.roles.cache.has(`992122876394225814`))
await r9.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r9_list = await r9.map(async (r9s) => {
    const userData = await User.findOne({ userid: r9s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r9s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r9_res = await Promise.all(r9_list)

//Владыка
const r8 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && member.roles.cache.has(`849695880688173087`) && member.roles.cache.has(`780487593485008946`))
await r8.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r8_list = await r8.map(async (r8s) => {
    const userData = await User.findOne({ userid: r8s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r8s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r8_res = await Promise.all(r8_list)

//Легенда
const r7 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && member.roles.cache.has(`780487593485008946`))
await r7.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r7_list = await r7.map(async (r7s) => {
    const userData = await User.findOne({ userid: r7s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r7s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r7_res = await Promise.all(r7_list)

//Звездочка
const r6 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && member.roles.cache.has(`553593976037310489`))
await r6.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r6_list = await r6.map(async (r6s) => {
    const userData = await User.findOne({ userid: r6s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r6s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r6_res = await Promise.all(r6_list)

//Чемпион
const r5 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`553593976037310489`) && member.roles.cache.has(`553593136027533313`))
await r5.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r5_list = await r5.map(async (r5s) => {
    const userData = await User.findOne({ userid: r5s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r5s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r5_res = await Promise.all(r5_list)

//Мастер
const r4 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`553593136027533313`) && member.roles.cache.has(`553593133884112900`))
await r4.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r4_list = await r4.map(async (r4s) => {
    const userData = await User.findOne({ userid: r4s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r4s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r4_res = await Promise.all(r4_list)

//Профессионал
const r3 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`553593136027533313`) && !member.roles.cache.has(`553593133884112900`) && member.roles.cache.has(`553593136895623208`))
await r3.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r3_list = await r3.map(async (r3s) => {
    const userData = await User.findOne({ userid: r3s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r3s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r3_res = await Promise.all(r3_list)

//Специалист
const r2 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`553593136027533313`) && !member.roles.cache.has(`553593133884112900`) && !member.roles.cache.has(`553593136895623208`) && member.roles.cache.has(`553593734479216661`))
await r2.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r2_list = await r2.map(async (r2s) => {
    const userData = await User.findOne({ userid: r2s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r2s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r2_res = await Promise.all(r2_list)

//Новичок
const r1 = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has(`992123019793276961`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`553593136027533313`) && !member.roles.cache.has(`553593133884112900`) && !member.roles.cache.has(`553593136895623208`) && !member.roles.cache.has(`553593734479216661`) && member.roles.cache.has(`553593731953983498`))
await r1.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
const r1_list = await r1.map(async (r1s) => {
    const userData = await User.findOne({ userid: r1s.user.id })
    let nickname
    let age
    if (!userData) {
        age = `Возраст не указан`
        nickname = `Никнейм не указан`
    } else {
        age = userData.age
        nickname = userData.nickname
    }

    return `${r1s} ➖ \`${age} лет\` ➖ \`${nickname}\``
})
let r1_res = await Promise.all(r1_list)