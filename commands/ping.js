const Discord = require("discord.js");

const { version } = require("discord.js");

let os = require("os");
let cpuStat = require("cpu-stat");
const ms = require("ms");
const fs = require("fs");

exports.run = (client, message, args) => {
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  const content = locale.ping;
  const tokens = require("../tokens.json");

  var lancement = new Discord.MessageEmbed()
    .setDescription(content.loading)
    .setColor("2f3136");

  message.channel.send(lancement).then((m) => {
    const FastSpeedtest = require("fast-speedtest-api");

    let speedtest = new FastSpeedtest({
      token: `${tokens.speedtest}`, // required
      verbose: false, // default: false
      timeout: 10000, // default: 5000
      https: true, // default: true
      urlCount: 5, // default: 5
      bufferSize: 8, // default: 8
      unit: FastSpeedtest.UNITS.Mbps, // default: Bps
    });

    cpuStat.usagePercent(function (err, percent, seconds) {
      if (err) {
        return console.log(err);
      }
      speedtest
        .getSpeed()
        .then((s) => {
          const embedStats = new Discord.MessageEmbed()
            .setTitle(content.title)
            .addField(
              `:desktop: ${content.title}`,
              "• CPU : ``" +
                os.cpus().map((i) => `${i.model}`)[0] +
                "``\n" +
                "• Arch : ``" +
                os.arch() +
                "``\n" +
                "• OS : ``" +
                os.platform() +
                "``\n" +
                "• Discord.js : " +
                "v" +
                version +
                "\n" +
                "• NodeJS : " +
                process.version +
                "\n"+
                "• Ping : " +
                client.ws.ping+"ms" 
            )
            .addField(
              `:minidisc: **${content.f1}**`,
              `• ${content.f2} : ` +
                (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) +
                "/" +
                (os.totalmem() / 1024 / 1024).toFixed(2) +
                " MB\n" +
                `• ${content.f3} : ` +
                `\`${percent.toFixed(2)}%\`` +
                `\n• ${content.f4} : ` +
                Math.round(s) +
                " mb/s"
            )
            .setColor(
              locale.colors[Math.floor(Math.random() * locale.colors.length)]
            )
            .setThumbnail(client.user.avatarURL())
            .setFooter(
              client.user.username + locale.general.footer,
              client.user.avatarURL()
            );

          m.edit(embedStats);
        })
        .catch((e) => {
          console.error(e.message);
        });
    });
  });
};
