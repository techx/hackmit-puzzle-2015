# HackMIT Puzzle

Woo puzzle! :)

Source code and stuff for every puzzle should go in its own subdirectory.

Please don't commit huge binaries and stuff that should be fetched via `npm
install`, etc.

It's fine to check in our own graphics assets and stuff.

## Deploying to AWS

If you have some service running on some weird port (say 8080 for example) and
want to forward port 80, do this:

```
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo sh -c "iptables-save > /etc/iptables.rules"
```

If you have some service that you have to run manually using `$cmd`, you can do
the following to background it:

1. `screen` to open up a new screen
2. `until $cmd; do echo "Server crashed, restarting..."; done`
3. `Control+A+D` to exit the screen. You can now exit your shell prompt.
4. To check if any programs are running in the background this way, type `screen -list`
5. To view the output of your server, type `screen -r`

Note that it would probably be better to wrap this in something that watches
for failures and reboots if necessary. Also, auto-starting when the machine
boots up is nice.

## Puzzle Hosting Stuff

| Number | Name           | Domain                        | Where hosted |
| ------:| -------------- | ----------------------------- | ------------ |
|    All | Command Center | `0xbaff1edd09e.dogemit.party` | AWS          |
|      0 | Splash Page    | `dogemit.party`               | Github Pages |
|      1 | Slack          | `0xd09ec0de.dogemit.party`    | AWS          |
|      2 | Origami        | `0x5e1f1ed09e.dogemit.party`  | Github Pages |
|      3 | QR             | `0xd09eb17e.dogemit.party`    | AWS          |
|      4 | Audio          | `0xff7d09e.dogemit.party`     | Github Pages |
|      5 | Maze           | `0xd09eeffec7.dogemit.party`  | AWS          |
|      6 | Stronghold     | `0xd09e5ec.dogemit.party`     | AWS          |

