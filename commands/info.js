exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  const axios = require("axios");
  let config = require("../config.json");
  const tokens = require("../tokens.json");
  const locale = require(`../locales/${config.locale}.json`);
  const content = locale.info;

  if (!args[0]) return message.channel.send(content.errNA);

  let loading = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor("2f3136");

  message.channel.send(loading).then((m) => {
    axios
      .get(
        "https://avwx.rest/api/station/" +
          args[0].toUpperCase() +
          "?format=json",
        {
          headers: {
            Authorization: `${tokens.avwx}`,
          },
        }
      )
      .then((response) => {
        const geoTz = require("geo-tz");
        let TZ = geoTz(response.data.latitude, response.data.longitude);
        const date = new Date(Date.now());
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        let HeureLoc = date.toLocaleString("fr-FR", {
          timeZone: TZ[0],
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        let embed = new Discord.MessageEmbed()
          .setTitle(content.title + args[0].toUpperCase())
          .setDescription(
            "```ICAO : " +
              response.data.icao +
              "\nIATA : " +
              response.data.iata +
              "```" +
              `\n**${content.f3} :** ` +
              response.data.name +
              `\n**${content.f35} :** ` +
              `${HeureLoc}` +
              `\n**${content.f1}** ${response.data.city} (${response.data.country})` +
              `\n**🔎 Latitude/Longitude :** ${response.data.latitude}/${response.data.longitude}` +
              `\n**${content.f2} :** ${response.data.elevation_m}m`
          )
          .setColor(
            locale.colors[Math.floor(Math.random() * locale.colors.length)]
          )
          .setThumbnail(client.user.avatarURL())
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          );

        let compteur = 0;
        response.data.runways.forEach(function (element) {
          compteur++;
          embed.addField(
            `${content.f4} ${compteur} (${element.ident1}-${element.ident2})`,
            ` ${content.f5} : ${element.length_ft}ft\n${content.f6} : ${
              element.width_ft
            }ft\n• **Surface** : ${
              element.surface !== null ? `${element.surface}` : "?"
            }
    `
          );
        });

        embed.addField(
          `${content.link}`,
          `• [${
            response.data.website !== null
              ? `${response.data.website}`
              : `${content.nE}`
          }](${response.data.website})\n• [[Wikipedia]](${
            response.data.wiki !== null
              ? `${response.data.wiki}`
              : `${content.nW}`
          })`
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
