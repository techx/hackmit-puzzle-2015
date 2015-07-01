# Description:
#   sets custom dogebot responses
#
# Dependencies:
#
# Configuration:
#
# Commands:
#   dogebot speak - How to speak with doges
#
# Notes:
#
# Author:
#   kimberli

# helpful http://doatt.com/2015/02/18/the-hubot-msg-object/

module.exports = (robot) ->

  robot.brain.set 'line_num', 0

  #general channel responses

  robot.respond /speak/i, (res) ->
    res.send "so very much such pls many wow amaze"

  robot.hear /much (.*)/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "much confuse"

  robot.hear /very (.*)/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "very doge"

  robot.hear /so (.*)/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "so bot"

  robot.hear /such (.*)/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "such puzzle"

  robot.hear /many (.*)/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "many swag"

  robot.hear /pls/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "pls message direct"

  robot.hear /wow/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "wow #{res.message.user.name.toLowerCase()}"

  robot.hear /amaze/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "amaze #{res.message.user.name.toLowerCase()}"

  #direct message responses

  robot.hear /much|very|so|such|wow|many|amaze/i, (res) ->
    if res.message.room.toLowerCase() == res.message.user.name.toLowerCase()
      num = robot.brain.get 'line_num'
      res.send "#{lines[num]}"
      if num == 8
        robot.brain.set 'line_num', 0
      else
        robot.brain.set 'line_num', num+1

lines = [
  "shh this is message from dogebot",
  "shh pls send dogebot to hackmit",
  "very amaze is 'amaze '",
  "very believe is 'robot'",
  "such bark much woof",
  "very excite is amaze + woof",
  "wow excite",
  "very hack is plz bark with believe",
  "console dose loge with hack"
]
