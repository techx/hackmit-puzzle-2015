fs = require 'fs'
#helpful http://doatt.com/2015/02/18/the-hubot-msg-object/
#helper methods
get_random_int = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min

module.exports = (robot) ->

  robot.brain.set 'responses', lines

  #general channel responses

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

  robot.hear /pls/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "pls message"

  robot.hear /wow/i, (res) ->
    if res.message.room.toLowerCase() == "general"
      res.send "wow #{res.message.user.name.toLowerCase()}"

  #direct message responses

  robot.hear /much|very|so|such|wow/i, (res) ->
    if res.message.room.toLowerCase() == res.message.user.name.toLowerCase()
      line_num = get_random_int(0,lines.length-1)
      res.send "#{lines[line_num]} (#{letters[line_num]})"

letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

lines = ["shh this is message from dogebot",
  "shh pls send dogebot to hackmit",
  "very hack is 'doge'",
  "very believe is 'mit'",
  "very amaze is '.party'",
  "very treat is 'http'",
  "such bark",
  "    plz secret with 'a doge'",
  "wow",
  "such woof",
  "    plz secret with 'a shibe'",
  "wow",
  "such secret much doge",
  "  rly doge is 'a shibe'",
  "    treat is treat + '://'",
  "    treat is treat + hack",
  "  but rly doge is 'a doge'",
  "    treat is treat + believe",
  "  but",
  "    treat is treat + amaze",
  "  wow",
  "wow treat",
  "plz woof",
  "plz bark",
  "very hackdoge is plz secret with 'a biscit'",
  "windoge.location dose replace with hackdoge"
  ]
