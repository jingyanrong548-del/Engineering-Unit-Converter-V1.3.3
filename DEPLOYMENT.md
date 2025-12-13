# GitHub Pages 部署说明

## 自动部署配置

项目已配置 GitHub Actions 自动部署到 GitHub Pages。

## 启用 GitHub Pages

1. 访问您的 GitHub 仓库：`https://github.com/jingyanrong548-del/Engineering-Unit-Converter-V1.3.3`
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分，选择：
   - **Source**: `GitHub Actions`
5. 保存设置

## 部署流程

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 安装依赖
2. 构建项目
3. 部署到 GitHub Pages

## 访问应用

部署完成后，应用将在以下地址可用：
`https://jingyanrong548-del.github.io/Engineering-Unit-Converter-V1.3.3/`

## 手动触发部署

如果需要手动触发部署：
1. 访问仓库的 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow**

## 故障排除

如果部署失败：
1. 检查 **Actions** 标签页中的错误信息
2. 确保 GitHub Pages 已启用并设置为使用 **GitHub Actions**
3. 确保仓库有足够的权限（Settings > Actions > General > Workflow permissions）

