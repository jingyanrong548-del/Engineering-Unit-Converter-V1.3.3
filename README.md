# 工程单位换算器 (Engineering Unit Converter)

一个功能强大的工程单位换算器，支持多种物理量的单位转换，包括温度、压力、功率、能量、流量等。

## 功能特性

- 🌍 支持中英文双语界面
- 🔄 多种单位类别：温度、压力、功率、能量、流量、密度、粘度等
- 💧 特殊换算：水质（电导率/电阻率/TDS）换算
- 📐 常用物理常数查询
- 📱 响应式设计，支持移动端和桌面端
- ⚡ 基于 Vite 构建，开发体验优秀

## 技术栈

- **构建工具**: Vite 5.0
- **样式框架**: Tailwind CSS (CDN)
- **字体**: Inter

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
.
├── index.html          # 主 HTML 文件
├── src/
│   ├── main.js        # 主 JavaScript 逻辑
│   └── styles.css     # 自定义样式
├── package.json        # 项目配置和依赖
├── vite.config.js     # Vite 配置文件
└── README.md          # 项目说明文档
```

## 版本历史

- **v2.0.0** - 重大更新：添加燃料热值与碳因子转换（包括氢气、生物质、管道蒸汽、电力），新增kWh/kg和kWh/ton单位，优化界面设计
- **v1.5.0** - 迁移到 Vite 项目结构
- **v1.3.3** - 初始版本

## 作者

荆炎荣

## 许可证

MIT

