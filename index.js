const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();

client.on("ready", () => {
  client.user.setPresence({
    activity: {
      name: `@SeniorBot`,
      type: "WATCHING",
    },
  });
  console.log(`[Senior-Bot] Presence updated successfully!`);
});

client.on("message", async (message) => {
  if (message.content.startsWith("-senior")) {
    message.channel
      .send(`Click on the reaction "✅" to receive a list of channel messages.`)
      .then(async (msg) => {
        await msg.react("✅");

        const filter = (reaction, user) => {
          return (
            "✅".includes(reaction.emoji.name) &&
            message.author.id.includes(user.id)
          );
        };
        const collector = msg.createReactionCollector(filter, { time: 10000 }); // 10 seconds

        collector.on("collect", () => {
          message.channel.messages.fetch().then(async (messages) => {
            let messageArray = [];

            const putInArray = async (data) => messageArray.push(data);
            for (const message of messages.array().reverse()) {
              await putInArray(
                `${message.author.username}, ${message.content}`
              );
            }
            message.channel.send(
              new Discord.MessageEmbed().setDescription(messageArray)
            );
          });
        });

        collector.on("end", (collected) => {
          message.channel.send(`Finalized! ${collected.size} collected.`);
        });
      });
  }
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("[Senior-Bot] Bot successfully initialized!"))
  .catch((error) =>
    console.error(
      `[Senior-Bot] An error was encountered.\n[Error-Message] ${error.message}`
    )
  );
