@echo off
chcp 65001 >nul
title 简历静态站点 - 一键构建并部署到腾讯云 EdgeOne

echo ======================================================================
echo   🚀 简历静态站点 - 构建 + 部署到腾讯云 EdgeOne Makers
echo ======================================================================
echo.

cd /d "%~dp0"

REM ============ 配置区（首次使用请填写） ============
set PROJECT_NAME=my-resume
REM 在此填入你的 EdgeOne API Token（控制台 → Makers → API Token 创建）
REM 也可通过环境变量传入：set EDGEONE_API_TOKEN=xxx
if "%EDGEONE_API_TOKEN%"=="" set EDGEONE_API_TOKEN=在此填入你的Token
REM 部署区域：global（国际站）或 overseas
set DEPLOY_AREA=global
REM ==================================================

echo [1/3] 检查 Node.js 环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/3] 构建静态站点...
node build-static.js
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo [3/3] 部署到 EdgeOne Makers...
where edgeone >nul 2>nul
if %errorlevel% neq 0 (
    echo 未检测到 edgeone CLI，正在安装...
    npm install -g edgeone
)

if "%EDGEONE_API_TOKEN%"=="在此填入你的Token" (
    echo.
    echo [提示] 未配置 API Token，将使用交互式登录部署。
    echo        首次会自动打开浏览器登录腾讯云。
    echo.
    edgeone makers deploy ./dist -n %PROJECT_NAME% -a %DEPLOY_AREA%
) else (
    edgeone makers deploy ./dist -n %PROJECT_NAME% -t %EDGEONE_API_TOKEN% -a %DEPLOY_AREA%
)

echo.
echo ======================================================================
echo   ✅ 流程结束
echo ======================================================================
echo   前台简历：https://%PROJECT_NAME%.edgeone.cool/
echo   后台管理：https://%PROJECT_NAME%.edgeone.cool/admin/
echo   投递记录：https://%PROJECT_NAME%.edgeone.cool/admin/jobs.html
echo ======================================================================
echo.
pause
