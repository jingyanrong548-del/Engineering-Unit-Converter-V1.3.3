#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    GitHub 部署流程 - 分步执行${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    echo -e "${YELLOW}请选择要执行的步骤:${NC}"
    echo -e "  ${GREEN}1${NC}. git pull          - 拉取最新代码"
    echo -e "  ${GREEN}2${NC}. git add .        - 添加所有更改"
    echo -e "  ${GREEN}3${NC}. git commit       - 提交更改"
    echo -e "  ${GREEN}4${NC}. git push         - 推送到 GitHub"
    echo -e "  ${GREEN}5${NC}. npm run deploy   - 部署到 GitHub Pages"
    echo -e "  ${GREEN}6${NC}. 执行全部步骤"
    echo -e "  ${GREEN}0${NC}. 退出"
    echo -e ""
}

execute_step() {
    case $1 in
        1)
            echo -e "${YELLOW}[步骤 1] 拉取最新代码 (git pull)...${NC}"
            if git pull origin main; then
                echo -e "${GREEN}✓ 拉取成功${NC}\n"
            else
                echo -e "${RED}✗ 拉取失败${NC}\n"
            fi
            ;;
        2)
            echo -e "${YELLOW}[步骤 2] 添加所有更改 (git add .)...${NC}"
            if git add .; then
                echo -e "${GREEN}✓ 添加成功${NC}\n"
            else
                echo -e "${RED}✗ 添加失败${NC}\n"
            fi
            ;;
        3)
            echo -e "${YELLOW}[步骤 3] 提交更改 (git commit)...${NC}"
            read -p "请输入提交信息: " commit_msg
            if [ -z "$commit_msg" ]; then
                commit_msg="更新项目: $(date '+%Y-%m-%d %H:%M:%S')"
            fi
            if git commit -m "$commit_msg"; then
                echo -e "${GREEN}✓ 提交成功: $commit_msg${NC}\n"
            else
                echo -e "${YELLOW}⚠ 没有更改需要提交${NC}\n"
            fi
            ;;
        4)
            echo -e "${YELLOW}[步骤 4] 推送到 GitHub (git push)...${NC}"
            if git push origin main; then
                echo -e "${GREEN}✓ 推送成功${NC}\n"
            else
                echo -e "${RED}✗ 推送失败${NC}\n"
            fi
            ;;
        5)
            echo -e "${YELLOW}[步骤 5] 部署到 GitHub Pages (npm run deploy)...${NC}"
            if npm run deploy; then
                echo -e "\n${GREEN}========================================${NC}"
                echo -e "${GREEN}   ✓✓✓ 部署完成！${NC}"
                echo -e "${GREEN}========================================${NC}"
                echo -e "${GREEN}应用地址: https://jingyanrong548-del.github.io/Engineering-Unit-Converter-V1.3.3/${NC}\n"
            else
                echo -e "${RED}✗ 部署失败${NC}\n"
            fi
            ;;
        6)
            echo -e "${YELLOW}执行全部步骤...${NC}\n"
            execute_step 1
            execute_step 2
            execute_step 3
            execute_step 4
            execute_step 5
            ;;
        0)
            echo -e "${BLUE}退出${NC}\n"
            exit 0
            ;;
        *)
            echo -e "${RED}无效的选择，请重新输入${NC}\n"
            ;;
    esac
}

# 主循环
while true; do
    show_menu
    read -p "请输入选项 (0-6): " choice
    echo ""
    execute_step $choice
    if [ "$choice" != "0" ] && [ "$choice" != "6" ]; then
        read -p "按回车键继续..."
        echo ""
    fi
done

