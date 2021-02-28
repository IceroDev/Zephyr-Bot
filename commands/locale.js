exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  let config = require("../config.json");
  let actual = config.locale;
  const locale = require(`../locales/${config.locale}.json`);
  const fs = require("fs");
  let admins = ["499608622003781632", "495874584650842123"];
  let available = ["en", "fr"];

  if (!admins.includes(message.author.id)) return message.react("❌");
  if (!args[0]) return message.reply(locale.locale.err1);
  if (!available.includes(args[0])) return message.reply(locale.locale.err2);
  if (config.locale == args[0]) return message.reply(locale.locale.err3);

  config.locale = args[0];

  fs.writeFile("./config.json", JSON.stringify(config), (err) => {
    if (err) console.log(err);
  });

  message.react("✅");
  message.channel.send(`${actual} => ${args[0]}`);
};
