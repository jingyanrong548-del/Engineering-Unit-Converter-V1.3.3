#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    GitHub 部署流程${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Pull 最新代码
echo -e "${YELLOW}[1/5] 拉取最新代码 (git pull)...${NC}"
if git pull origin main; then
    echo -e "${GREEN}✓ 拉取成功${NC}\n"
else
    echo -e "${RED}✗ 拉取失败，继续执行...${NC}\n"
fi

# 2. Add 所有更改
echo -e "${YELLOW}[2/5] 添加所有更改 (git add .)...${NC}"
if git add .; then
    echo -e "${GREEN}✓ 添加成功${NC}\n"
else
    echo -e "${RED}✗ 添加失败${NC}\n"
    exit 1
fi

# 3. Commit
echo -e "${YELLOW}[3/5] 提交更改 (git commit)...${NC}"
if [ -z "$1" ]; then
    read -p "请输入提交信息 (直接回车使用默认信息): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="更新项目: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
else
    commit_msg="$1"
fi

if git commit -m "$commit_msg"; then
    echo -e "${GREEN}✓ 提交成功: $commit_msg${NC}\n"
else
    echo -e "${YELLOW}⚠ 没有更改需要提交，继续执行...${NC}\n"
fi

# 4. Push
echo -e "${YELLOW}[4/5] 推送到 GitHub (git push)...${NC}"
if git push origin main; then
    echo -e "${GREEN}✓ 推送成功${NC}\n"
else
    echo -e "${RED}✗ 推送失败${NC}\n"
    exit 1
fi

# 5. Deploy
echo -e "${YELLOW}[5/5] 部署到 GitHub Pages (npm run deploy)...${NC}"
if npm run deploy; then
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}   ✓✓✓ 部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}应用地址: https://jingyanrong548-del.github.io/Engineering-Unit-Converter-V1.3.3/${NC}\n"
else
    echo -e "${RED}✗ 部署失败${NC}\n"
    exit 1
fi

