exports.run = (client, message, args) => {
  var Discord = require(`discord.js`);
  const axios = require(`axios`);
  let config = require(`../config.json`);
  const locale = require(`../locales/${config.locale}.json`);
  const tokens = require("../tokens.json");
  const content = locale.flight;
  let errorE = new Discord.MessageEmbed()
    .setTitle(content.errDBT)
    .setDescription(`${content.errDB}(${args[0]})`)
    .setColor(`RED`)
    .setFooter(
      client.user.username + locale.general.footer,
      client.user.avatarURL()
    );
  let loading = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor(`2f3136`);
  message.channel.send(loading).then(m => {
    axios
      .get(
        `http://api.aviationstack.com/v1/flights?access_key=${tokens.aviationstack}&flight_iata=${args[0]}`
      )
      .then((data) => {
        let flight = data.data.data[0];
        if (flight == undefined) return message.reply(errorE);
        if (!flight.departure.airport) return message.channel.send(embedE);
        const date = new Date(Date.now());

        const arrival = new Date(flight.arrival.estimated);
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
        };
        let loc1 = date.toLocaleString(`fr-FR`, {
          timeZone: flight.departure.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        let loc2 = date.toLocaleString(`fr-FR`, {
          timeZone: flight.arrival.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        let arrDep = arrival.toLocaleString(`fr-FR`, {
          timeZone: flight.departure.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        let arrArr = arrival.toLocaleString(`fr-FR`, {
          timeZone: flight.arrival.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        let embed = new Discord.MessageEmbed()
          .setTitle(`${content.title} ` + args[0])
          .setDescription(
            `🗺️ **${flight.departure.airport}** ➡️ **${flight.arrival.airport}**\n**${flight.airline.name}**`
          )
          .addField(
            `${content.desc}`,
            `**IATA/ICAO** : ${flight.departure.iata}/${flight.departure.icao}` +
              `\n**${content.f1}** : \n• **${content.f1a}** : ${
                flight.departure.terminal !== null
                  ? `${flight.departure.terminal}`
                  : `?`
              }\n• **${content.f1b}** : ${
                flight.departure.gate !== null
                  ? `${flight.departure.gate}`
                  : `?`
              }`
          )
          .addField(
            `${content.f2}`,
            `**IATA/ICAO** : ${flight.arrival.iata}/${flight.arrival.icao}` +
              `\n**${content.f2a}** : \n• **${content.f1a}** : ${
                flight.arrival.terminal !== null
                  ? `${flight.arrival.terminal}`
                  : `?`
              }\n• **${content.f1b}** : ${
                flight.arrival.gate !== null ? `${flight.arrival.gate}` : `?`
              }\n• **Baggages** : ${
                flight.arrival.baggage !== null
                  ? `${flight.arrival.baggage}`
                  : `?`
              }`
          )
          .addField(
            `${content.f3}`,
            `${content.f3a} ${loc1}\n${content.f3b} ${loc2}` +
              `\n\n${content.f3c} ${arrDep}\n${content.f4c} ${arrArr}`
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
        console.log(error);
        let embed = new Discord.MessageEmbed()
          .setTitle(`${content.cET}`)
          .setDescription(`${content.cE}`)
          .setColor(`RED`)
          .setFooter(
            client.user.username + locale.general.footer,
            client.user.avatarURL()
          );
        m.edit(embed);
      });
  });
};
