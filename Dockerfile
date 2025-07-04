# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 拷贝所有前端文件到 nginx 的 html 目录
COPY . /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 