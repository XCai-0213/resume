@echo off
chcp 65001 >nul
title 个人简历展示与后台管理系统

echo ======================================================================
echo   🚀 正在启动 个人简历系统 与 可视化后台管理面板...
echo ======================================================================
echo.

cd /d "%~dp0"

echo 正在检查 Node.js 环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)。
    pause
    exit /b 1
)

echo 前台简历展示: http://localhost:8080
echo 后台管理面板: http://localhost:8080/admin/
echo.
echo 正在自动打开管理后台...
start http://localhost:8080/admin/

node server.js

pause
