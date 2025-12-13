# 部署使用说明

## 快速开始

### 方式 1：一键自动部署（推荐）

```bash
npm run upload
```

这会自动执行：`pull → add → commit → push → deploy`

### 方式 2：分步交互式执行

```bash
npm run step
```

会显示菜单，你可以选择执行哪个步骤。

### 方式 3：手动分步执行

```bash
# 步骤 1: 拉取最新代码
npm run step1

# 步骤 2: 添加所有更改
npm run step2

# 步骤 3: 提交更改（需要输入提交信息）
npm run step3

# 步骤 4: 推送到 GitHub
npm run step4

# 步骤 5: 部署到 GitHub Pages
npm run step5
```

## 常见情况处理

### 情况 1: "nothing to commit, working tree clean"

**原因**: 所有更改都已经提交了，没有新的更改。

**处理**: 
- 这是正常情况，可以直接执行 `npm run step4` (push) 和 `npm run step5` (deploy)
- 或者如果有新更改，先修改文件，然后再执行步骤 2 和 3

### 情况 2: 只想部署，不提交新代码

如果代码已经提交并推送，只需要部署：

```bash
npm run step5
# 或者
npm run deploy
```

### 情况 3: 有未跟踪的文件

如果有新文件需要添加：

```bash
npm run step2  # git add .
npm run step3  # git commit
npm run step4  # git push
npm run step5  # deploy
```

## 完整流程示例

```bash
# 1. 修改代码后，开始部署流程
npm run step1  # 拉取最新代码（避免冲突）

# 2. 添加更改
npm run step2  # git add .

# 3. 提交更改
npm run step3  # 会提示输入提交信息

# 4. 推送到 GitHub
npm run step4  # git push

# 5. 部署到 GitHub Pages
npm run step5  # npm run deploy
```

## 提示

- 如果某个步骤显示 "nothing to commit"，说明该步骤已经完成，可以继续下一步
- 使用 `git status` 可以查看当前 Git 状态
- 使用 `npm run step` 可以进入交互式菜单，更灵活地控制每个步骤

