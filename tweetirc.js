var TwitterNode = require('./lib/twitter-node/lib').TwitterNode;
var IRC        = require("./lib/IRC/lib/irc");
var config      = require("./config").load()
var sys         = require('sys');

var bot = new IRC({ server: config.irc.server
                    , nick: config.irc.nick
                    , channels: [config.irc.room] 
                  })

bot.connect(function(){
    setTimeout(function() {
      // Join channels
      if (!!bot.options.channels && bot.options.channels instanceof Array)
        for (var i = 0; i < bot.options.channels.length; i++) {
          this.join(bot.options.channels[i])
          this.privmsg(bot.options.channels[i], "I am tweetcasting for your mom!")
        }
    }.bind(this), 15000)
  })


var twit = new TwitterNode({  user: config.twitter.account
                              , password: config.twitter.password
                              , track: config.twitter.terms 
                          });

function html_decode(txt) {
  return txt.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&");
}


twit.addListener('tweet', function(tweet) {
    bot.privmsg(config.irc.room, ["@",tweet.user.screen_name, ": ", html_decode(tweet.text)].join(""))
  }).stream();
