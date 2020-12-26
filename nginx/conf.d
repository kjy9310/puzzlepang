# server { # simple reverse-proxy
#     listen       80;
#     location / {
#     proxy_pass       http://localhost:8000; 
#     proxy_set_header Host      $host;       
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_pass_request_headers      on;     
#     proxy_set_header Upgrade $http_upgrade; 
#     proxy_set_header Connection "upgrade";  
#     }
# }