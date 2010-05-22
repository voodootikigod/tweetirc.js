var TwitterNode = require('./twitter-node/lib').TwitterNode;
var IRC        = require("./IRC/lib/irc");
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


twit
  .addListener('tweet', function(tweet) {
    bot.privmsg(config.irc.room, "@" + tweet.user.screen_name + ": " + tweet.text)
  }).addListener('limit', function(limit) {
    sys.puts("LIMIT: " + sys.inspect(limit));
  }).addListener('delete', function(del) {
    sys.puts("DELETE: " + sys.inspect(del));
  }).addListener('end', function(resp) {
    sys.puts("wave goodbye... " + resp.statusCode);
  }).stream();
