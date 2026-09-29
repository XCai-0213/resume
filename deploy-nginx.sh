#!/bin/bash
# 为简历系统配置 Nginx 反向代理：classroom.jyue.cn -> 127.0.0.1:8080
set -e

CONF=/etc/nginx/sites-available/classroom.jyue.cn

echo "===== 1/4 备份现有配置 ====="
if [ -f "$CONF" ]; then
  cp "$CONF" "/etc/nginx/backups/classroom.jyue.cn.conf.bak-$(date +%Y%m%d-%H%M%S)"
  echo "已备份"
fi

echo "===== 2/4 写入新配置 ====="
cat > "$CONF" <<'NGINX'
# classroom.jyue.cn -> 个人简历系统 (127.0.0.1:8080, systemd: resume)
# 数据存储在 /opt/resume/shared/data，所有浏览器访问自动同步

server {
    listen 80;
    listen [::]:80;
    server_name classroom.jyue.cn;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name classroom.jyue.cn;

    ssl_certificate     /etc/letsencrypt/live/classroom.jyue.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/classroom.jyue.cn/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # 图片上传可能较大
    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # PDF 导出等长任务
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
NGINX
echo "配置已写入"

echo "===== 3/4 启用站点 ====="
ln -sfn "$CONF" /etc/nginx/sites-enabled/classroom.jyue.cn
nginx -t
echo "配置语法检查通过"

echo "===== 4/4 重载 Nginx ====="
systemctl reload nginx
sleep 2
echo "Nginx 已重载"

echo ""
echo "===== 验证 ====="
echo -n "本地后端:   "
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/api/resume
echo -n "HTTPS 访问: "
curl -s -o /dev/null -w "%{http_code}\n" -k https://classroom.jyue.cn/api/resume
echo -n "简历页面:   "
curl -s -o /dev/null -w "%{http_code}\n" -k https://classroom.jyue.cn/resume.html
echo -n "后台管理:   "
curl -s -o /dev/null -w "%{http_code}\n" -k https://classroom.jyue.cn/admin/
echo -n "个人主页:   "
curl -s -o /dev/null -w "%{http_code}\n" -k https://classroom.jyue.cn/
echo ""
echo "===== 完成 ====="
