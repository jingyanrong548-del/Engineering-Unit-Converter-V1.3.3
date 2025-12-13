# 快速部署指南

## 标准部署流程

按照以下顺序执行命令：

```bash
# 1. 拉取最新代码
npm run step1

# 2. 添加所有更改
npm run step2

# 3. 提交更改（手动输入提交信息）
git commit -m "你的提交信息"

# 4. 推送到 GitHub
npm run step4

# 5. 部署到 GitHub Pages
npm run step5
```

## 如果显示 "nothing to commit"

**这是正常的！** 说明：
- 所有更改都已经提交了
- 可以跳过步骤 3，直接执行步骤 4 和 5

```bash
# 如果代码已经提交，只需要推送和部署
npm run step4  # git push
npm run step5  # npm run deploy
```

## 一键自动部署

如果想一次性完成所有步骤：

```bash
npm run upload
```

## 交互式菜单

如果想更灵活地控制每个步骤：

```bash
npm run step
```

## 检查当前状态

随时可以查看 Git 状态：

```bash
git status
```

