exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  const axios = require("axios");
  let config = require("../config.json");
  const tokens = require("../tokens.json");
  const locale = require(`../locales/${config.locale}.json`);
  const content = locale.metar;

  if (!args[0]) return message.channel.send(content.errNA);
  let loading = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor("2f3136");

  message.channel.send(loading).then((m) => {
    axios
      .get(
        "https://avwx.rest/api/metar/" +
          args[0].toUpperCase() +
          "?options=info&airport=true&reporting=true&format=json&onfail=error",
        {
          headers: {
            Authorization: `${tokens.avwx}`,
          },
        }
      )
      .then((response) => {
        let embed = new Discord.MessageEmbed()
          .setTitle(content.title + " " + args[0].toUpperCase())
          .setDescription(
            `${content.d1} : ${response.data.info.name}` +
              "```" +
              response.data.raw +
              "```"
          )
          .addField(`${content.f1}`, `${response.data.flight_rules}`)
          .setColor(
            locale.colors[Math.floor(Math.random() * locale.colors.length)]
          )
          .setThumbnail(client.user.avatarURL())
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          )
          .addField(
            `${content.f2}`,
            `${content.f20} ${response.data.wind_direction.value}°\n${content.f21} ${response.data.wind_speed.value}${response.data.units.wind_speed}`
          );
        let compteur = 0;
        response.data.clouds.forEach(function (element) {
          compteur++;
          embed.addField(
            `${content.f3} ${compteur} (${element.repr})`,
            `${content.f4} : ${element.type}\n${content.f5} : ${element.altitude}ft
    `
          );
        });
        embed.addField(
          `${content.f6}`,
          `${response.data.altimeter.value}${response.data.units.altimeter}`
        );
        embed.addField(
          `${content.f7}`,
          `${response.data.temperature.value}°${response.data.units.temperature}/${response.data.dewpoint.value}°${response.data.units.temperature}`
        );
        embed.addField(
          `${content.f8}`,
          `${response.data.visibility.value}${response.data.units.visibility}`
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
