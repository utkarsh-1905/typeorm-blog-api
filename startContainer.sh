sudo docker stop blog-api
sudo docker rm blog-api
sudo docker rmi blog-api-image:latest
sudo docker build -t blog-api-image:latest .
sudo docker run -d -p 11211:4000 --net web --name blog-api -l traefik.http.routers.blogapi.rule="Host(\`blogapi.utkarsh.ninja\`)" -l traefik.http.routers.blogapi.tls=true -l traefik.http.routers.blogapi.tls.certresolver=lets-encrypt -l traefik.port=80 blog-api-image