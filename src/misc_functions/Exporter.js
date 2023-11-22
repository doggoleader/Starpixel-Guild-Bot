const { Activity } = require(`./Boxes/activity`)
const { Bag } = require(`./Boxes/bag`)
const { Big } = require(`./Boxes/big`)
const { Daily } = require(`./Boxes/daily`)
const { Easter } = require(`./Boxes/Easter`)
const { King } = require(`./Boxes/king`)
const { Mega } = require(`./Boxes/Mega`)
const { Monthly } = require(`./Boxes/monthly`)
const { Mystery } = require(`./Boxes/mystery`)
const { Myth } = require(`./Boxes/myth`)
const { Present } = require(`./Boxes/present`)
const { Prestige } = require(`./Boxes/prestige`)
const { Small } = require(`./Boxes/small`)
const { Spooky } = require(`./Boxes/spooky`)
const { Treasure } = require(`./Boxes/treasure`)
const { Summer } = require(`./Boxes/Summer`)
const { StaffBox } = require(`./Boxes/staffbox`)
const { Weekly } = require(`./Boxes/weekly`)
const { SeasonalWinner } = require(`./Boxes/SeasonalWinner`)
const { embed } = require(`./Premade Interactions & Embeds/Profile Settings Embed`)
const { selectmenu } = require(`./Premade Interactions & Embeds/Profile Settings Menu`)
const { UserProfile } = require(`./Classes/Profile/UserProfile`)
const { GuildProgress } = require(`./Classes/Profile/progress_class`)
const { StarpixelClient } = require(`./Classes/System/StarpixelClient`)
const { Profile } = require(`./Classes/Profile/Profile`)
const { Emotions } = require(`./Classes/Items/Emotions`)
const { lb_newyear, stats_newyear, gift_newyear, quests_newyear, lb_halloween, stats_halloween, quests_halloween, lb_easter, stats_easter, quests_easter, lb_summer,
    stats_summer, quests_summer} = require(`./Premade Interactions & Embeds/Seasonal Main Channels Components`)

module.exports = {
    Activity,
    Bag,
    Big,
    Daily,
    Easter,
    King,
    Mega,
    Monthly,
    Mystery,
    Myth,
    Present,
    Prestige,
    Small,
    Spooky,
    Treasure,
    Weekly,
    StaffBox,
    Summer,
    SeasonalWinner,
    embed,
    selectmenu,

    lb_newyear,
    stats_newyear,
    gift_newyear,
    quests_newyear,
    lb_halloween,
    stats_halloween,
    quests_halloween,
    lb_easter,
    stats_easter,
    quests_easter,
    lb_summer,
    stats_summer,
    quests_summer,
    
    GuildProgress,
    UserProfile,
    Profile,

    Emotions,

    StarpixelClient
}
