nohup http-server -p 3002
nohup ssh -o ServerAliveInterval=20 -p 22222 -R webtoonz:80:localhost:4200 uetbc.xyz
nohup ssh -o ServerAliveInterval=20 -p 22222 -R webtoonz-s3:80:localhost:3002 uetbc.xyz
nohup ssh -o ServerAliveInterval=20 -p 22222 -R webtoonz-s3-v2:80:localhost:3999 uetbc.xyz
pm2 serve . 3002