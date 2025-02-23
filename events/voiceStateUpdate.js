const { textChannelId, roleIdToPing, chrisId, carlosId, renegadeId, breekiId, sidewinderId, carlosGb } = require('../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const user = newState?.member || oldState?.member;
        if (!user || !user.user) return;

        console.log(`🔊 Voice state update detected for: ${user.user.username}`);

        const textChannel = await client.channels.fetch(textChannelId).catch(() => null);
        if (!textChannel) return;

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
    }
};
