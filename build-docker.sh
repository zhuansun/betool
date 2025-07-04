#!/bin/sh

# 构建 Docker 镜像，镜像名为 betool

echo "开始构建 Docker 镜像..."
docker build -t betool .

if [ $? -eq 0 ]; then
  echo "Docker 镜像构建成功，镜像名：betool"
else
  echo "Docker 镜像构建失败，请检查错误信息。"
  exit 1
fi 