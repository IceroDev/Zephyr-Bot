exports.run = (client, message, args) => {
  var Discord = require("discord.js");
  var prefix = require("../config.json");
  let actual = prefix.prefix;
  let config = require("../config.json");
  const locale = require(`../locales/${config.locale}.json`);
  const fs = require("fs");
  let admins = ["499608622003781632", "495874584650842123"];

  if (!admins.includes(message.author.id)) return message.react("❌");
  if (!args[0]) return message.reply(locale.prefix.err1);
  if (config.locale == args[0]) return message.reply(locale.prefix.err3);

  prefix.prefix = args[0];

  fs.writeFile("./config.json", JSON.stringify(prefix), (err) => {
    if (err) console.log(err);
  });
  
  message.react("✅");
  message.channel.send(`${actual} => ${args[0]}`);
};
