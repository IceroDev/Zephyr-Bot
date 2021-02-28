exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  let msg = args.join(" ");
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  const content = locale.feedback;

  var Uembed = new Discord.MessageEmbed()
    .setTitle(content.title)
    .setDescription(content.desc)
    .setColor(locale.colors[Math.floor(Math.random() * locale.colors.length)])
    .setThumbnail(client.user.avatarURL())
    .setFooter(
      client.user.username + locale.general.footer,
      client.user.avatarURL()
    );

  var Sembed = new Discord.MessageEmbed()
    .setTitle(content.title2)
    .addField(content.from, args.join(" "))
    .addField(content.f1, message.guild.name)
    .setColor(locale.colors[Math.floor(Math.random() * locale.colors.length)])
    .setThumbnail(client.user.avatarURL())
    .setAuthor(message.author.username, message.author.avatarURL())
    .setFooter(
      client.user.username + locale.general.footer,
      client.user.avatarURL()
    );

  message.channel.send(Uembed);
  client.channels.cache.get("792466195265617930").send(Sembed);
};
