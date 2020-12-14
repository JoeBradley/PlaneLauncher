#! /bin/bash
 
rootdir="/home/pi/Projects/PlaneLauncher/PlaneLauncher"
server="$rootdir/bin/www"
logfile="$rootdir/planelauncher.log" 
port=80
env=production

export PORT=$port
export NODE_ENV=$env

date +"%Y-%m-%d %T Start server: $server port:$port environment: $env" >> $logfile

echo -n $"Start server: $server port:$port environment:$env "

# Start node and log to file
#node $server >> $logfile && echo -n "success" || echo -n "failure"
node $server && echo -n "success" || echo -n "failure"

# Start node without logging
#node $server && echo -n "success" || echo -n "failure"

date +"%Y-%m-%d %T Stopping server" >> $logfile

echo ""