exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  const axios = require("axios");
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  const content = locale.charts;

  if (!args[0]) return message.channel.send(content.errNA);

  let loading = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor("2f3136");

  message.channel.send(loading).then((m) => {
    axios
      .get("https://vau.aero/navdb/chart/" + args[0].toUpperCase() + ".pdf")
      .then((response) => {
        let embed = new Discord.MessageEmbed()
          .setTitle(content.title + args[0].toUpperCase())
          .setDescription(
            "[https://vau.aero/navdb/chart/" +
              args[0].toUpperCase() +
              ".pdf](https://vau.aero/navdb/chart/" +
              args[0].toUpperCase() +
              ".pdf)"
          )
          .setColor(
            locale.colors[Math.floor(Math.random() * locale.colors.length)]
          )
          .setThumbnail(client.user.avatarURL())
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          );

        m.edit(embed);
      })
      .catch((error) => {
        let embed = new Discord.MessageEmbed()
          .setTitle(content.errNE)
          .setDescription(`**${args.join(" ")}** ` + locale.general.WA)
          .setColor("RED")
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          );
        m.edit(embed);
      });
  });
};
