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

```
nohup $cmd &
```

Note that it would probably be better to wrap this in something that watches
for failures and reboots if necessary. Also, auto-starting when the machine
boots up is nice.
