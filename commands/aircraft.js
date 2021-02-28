exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  let content = locale.aircraft;
  let db = require("./database.json").results;
  const axios = require("axios");

  let loading = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor("2f3136");

  message.channel.send(loading).then((m) => {
    let embed = new Discord.MessageEmbed()
      .setTitle(content.errDBT)
      .setDescription(`${content.errDB}`)
      .setColor("RED")
      .setFooter(
        client.user.username + locale.general.footer,
        client.user.avatarURL()
      );

    let compteur = 0;
    let response;
    let icao24;
    let registration;

    db.forEach(function (element) {
      if (element.registration == args[0].toUpperCase()) {
        response = compteur;
        icao24 = element.icao24.toUpperCase();
        registration = element.registration.toUpperCase();
      } else {
        compteur++;
      }
    });

    let aircraft = db[response];

    if (aircraft == undefined) return m.edit(embed);

    if (icao24 == undefined) {
      var ic24 = "error";
    } else {
      var ic24 = aircraft.icao24.toUpperCase();
    }

    if (registration == undefined) {
      var reg = "error";
    } else {
      var reg = aircraft.icao24.toUpperCase();
    }

    axios
      .get(
        `https://www.airport-data.com/api/ac_thumb.json?m=${ic24}&n=1&r=${reg}`
      )
      .then((callback) => {
        if (callback.data.error !== undefined) {
          var img = "https://netheberg.fr/oiekfs.png";
        } else {
          var TS = callback.data.data[0].image;
          var split = TS.split("/thumbnails");
          var img = "https://www.airport-data.com/images/aircraft" + split[1];
        }

        let embed = new Discord.MessageEmbed()
          .setTitle(content.title + args[0].toUpperCase())
          .setDescription(
            `• **${content.f1} :** ${
              aircraft.model !== "" ? `${aircraft.model}` : `?`
            }\n` +
              `• **${content.f2} :** ${
                aircraft.typecode !== "" ? `${aircraft.typecode}` : `?`
              }\n` +
              `• **${content.f3} :** ${
                aircraft.serialnumber !== "" ? `${aircraft.serialnumber}` : `?`
              }\n` +
              `• **${content.f4} :** ${
                aircraft.manufacturername !== ""
                  ? `${aircraft.manufacturername}`
                  : `?`
              }\n` +
              `• **${content.f5} :** ${
                aircraft.operatoricao !== "" ? `${aircraft.operatoricao}` : `?`
              }\n` +
              `• **icao24 :** ${
                aircraft.icao24 !== "" ? `${aircraft.icao24}` : `?`
              }\n` +
              `• **${content.f6} :** ${
                aircraft.owner !== "" ? `${aircraft.owner}` : `?`
              }\n` +
              `• **${content.f7} :** ${
                aircraft.built !== "" ? `${aircraft.built}` : `?`
              }\n` +
              `• **${content.f8} :** ${
                aircraft.engines !== "" ? `${aircraft.engines}` : `?`
              }\n` +
              `• **${content.f9} :** ${
                aircraft.categoryDescription !== ""
                  ? `${aircraft.categoryDescription}`
                  : `?`
              }\n`
          )
          .setImage(img)
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
        console.log(error);
        let embed = new Discord.MessageEmbed()
          .setTitle(content.cET)
          .setDescription(`${content.cE}`)
          .setColor("RED")
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          );
        m.edit(embed);
      });
  });
};
