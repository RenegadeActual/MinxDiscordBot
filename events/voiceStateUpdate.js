const { textChannelId, roleIdToPing, chrisId, carlosId, renegadeId, breekiId, sidewinderId, carlosGb } = require('../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const user = newState?.member || oldState?.member;
        if (!user || !user.user) return;

        console.log(`🔊 Voice state update detected for: ${user.user.username}`);

        const textChannel = await client.channels.fetch(textChannelId).catch(() => null);
        if (!textChannel) {
            console.log("❌ Bot cannot access the text channel! Check the ID & permissions.");
            return;
        }

        // ✅ VC Join/Leave Announcements (Existing Logic)
        const vcActions = {
            [chrisId]: { join: `👀 <@&${roleIdToPing}> **${user.user.username} finally decided to show up!**` },
            [carlosId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
            [renegadeId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
            [breekiId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
            [sidewinderId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` }
        };

        if (!oldState.channel && newState.channel && vcActions[user.id]?.join) {
            await textChannel.send(vcActions[user.id].join);
        }
        if (oldState.channel && !newState.channel && vcActions[user.id]?.leave) {
            await textChannel.send(vcActions[user.id].leave);
        }

        // ✅ New Feature: If VC is silent, MinxBot makes a comment
        if (newState.channel && newState.channel.members.size === 1) {
            setTimeout(() => {
                if (newState.channel && newState.channel.members.size === 1) {
                    textChannel.send("Wow, this is the most awkward silence I’ve ever heard.");
                }
            }, 300000); // 5 minutes
        }

        // ✅ New Feature: If someone leaves suddenly, MinxBot comments
        if (oldState.channel && !newState.channel) {
            textChannel.send(`🚪 **${user.user.username} just dipped. Guess they couldn't handle my greatness.**`);
        }
    }
};
