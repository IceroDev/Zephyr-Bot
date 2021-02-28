exports.run = (client, message, args) => {
  var Discord = require(`discord.js`);
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  let prefix = require("../config.json").prefix;
  let content = locale.help;

  let embed = new Discord.MessageEmbed()
    .setTitle(`${client.user.username} ${content.title}`)
    .addField(`✈️ ${prefix}aircraft <registration>`, `${content.h1}`)
    .addField(`🔖 ${prefix}charts <ICAO>`, `${content.h2}`)
    .addField(`📢 ${prefix}feedback <message>`, `${content.h3}`)
    .addField(`🛩️ ${prefix}flight <IATA>`, `${content.h4}`)
    .addField(`🛂 ${prefix}info <ICAO>`, `${content.h5}`)
    .addField(`🌤️ ${prefix}metar <ICAO>`, `${content.h6}`)
    .addField(`💻 ${prefix}ping`, `${content.h7}`)
    .setColor(locale.colors[Math.floor(Math.random() * locale.colors.length)])
    .setThumbnail(client.user.avatarURL())
    .setFooter(
      client.user.username + locale.general.footer,
      client.user.avatarURL()
    );

  message.channel.send(embed);
};
