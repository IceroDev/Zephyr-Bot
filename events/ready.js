module.exports = (client) => {
  console.log("Online");
    setInterval(() => {
        let config = require("../config.json")
        const activities_list = [
    `${config.prefix}help ${config.prefix}aircraft ${config.prefix}carts`, 
    `Stay safe, Stay home`,
    `Haute en Couleur, the bot providing all the necessary information to fly!`
    ];  
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
      client.user.setActivity(activities_list[index]);
  }, 10000);
};
