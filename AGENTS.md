# AGENTS.md — MangaPink AI 编码约束

> 本文件供 AI 编码助手（CatPaw 等）阅读，约束本项目的代码生成行为。

---

## 项目概述

**萌漫 MangaPink** — 二次元漫画阅读 App（原型阶段，纯前端 React Native + Expo）

- **技术栈**：React Native 0.74 + TypeScript + NativeWind v4 + Redux Toolkit + Expo
- **设计风格**：粉白甜美二次元风
- **数据来源**：本地 Mock 数据，不依赖任何网络请求

---

## 目录结构约定

```
src/
  screens/      # 页面级组件（含私有子组件）
  components/   # 全局公共组件（无状态/轻状态）
  navigation/   # React Navigation 配置
  store/        # Redux store、slice、selector
  hooks/        # 自定义 Hook（封装 store 逻辑）
  data/         # Mock 数据与资源映射表
  types/        # 全局 TypeScript 类型（manga.ts / chapter.ts）
  utils/        # 纯函数工具（constants / formatters / storage）
  theme/        # 颜色/字体常量
assets/         # 本地图片资源（covers / chapters / icons）
```

---

## TypeScript 规范

- ✅ 严格模式（`strict: true`），禁止使用 `any`
- ✅ 使用 `interface` 定义对象类型，`type` 定义联合/工具类型
- ✅ Redux 操作必须使用 `useAppDispatch` 和 `useAppSelector`（来自 `store/hooks.ts`）
- ✅ Navigation props 使用 `NativeStackScreenProps<ParamList, 'ScreenName'>` 类型
- ❌ 禁止在 Screen 组件中直接导入 `useDispatch` / `useSelector`，必须使用封装版

---

## 组件规范

- 单文件不超过 **200 行**，超出则拆分私有子组件（放入同级 `components/` 目录）
- 函数组件使用 `export default function ComponentName` 形式
- Props interface 命名为 `Props`（文件内部使用）
- 样式统一使用 `StyleSheet.create`，不使用内联对象
- NativeWind className 仅用于全局组件，不混用 StyleSheet 和 className

---

## NativeWind 使用规范

- `global.css` 是唯一的 Tailwind 入口，在 `App.tsx` 最顶部导入
- 颜色使用 `tailwind.config.js` 中定义的自定义色板（如 `bg-pink-400`、`text-textPrimary`）
- ❌ 禁止使用 `animate-*`、`transition-*` 类（RN 不兼容，动效用 react-native-reanimated）
- 布局首选 `flex-1`、`flex-row`、`items-center` 等 Flex 类

---

## Redux 规范

- 每个 slice 文件对应单一关注点（bookshelf / readingProgress / history）
- Selector 统一放在 `store/selectors/` 目录，不在组件内写内联 selector
- Redux Persist 配置在 `store/index.ts` 中，每个 slice 独立 persist config
- Action 命名采用 camelCase（如 `addToBookshelf`、`updateProgress`）

---

## FlatList 性能规范（阅读器）

- 必须配置：`windowSize={5}`、`maxToRenderPerBatch={3}`、`removeClippedSubviews={true}`
- 必须提供 `getItemLayout`（支持 `initialScrollIndex`）
- 使用 `expo-image` 而非 RN 原生 `Image`（更好的内存管理）
- `contentFit="fill"` 用于条漫（保留完整内容），`contentFit="cover"` 用于封面

---

## 资源管理规范

- 所有 `require()` 调用集中在 `src/data/assetMap.ts` 中
- 其他文件通过 key 查表（`CoverAssets[mangaId]`、`ChapterAssets[assetKey]`）
- 图片命名规范：小写 + 连字符，如 `manga-001.png`、`manga-001/ch-01/page-001.png`
- ❌ 禁止动态拼接 `require()` 路径（Metro bundler 静态分析限制）

---

## 导航规范

- 每个 Tab 有独立的 Stack（`HomeStack` / `ShelfStack` / `CategoryStack` / `ProfileStack`）
- `MangaDetailScreen` 和 `ReaderScreen` 在每个 Stack 内独立注册（避免跨 Tab 栈混乱）
- Navigation 参数类型定义在 `navigation/types.ts`
- 进入 ReaderScreen 时需通过 `navigation.push('Reader', { mangaId, chapterId, initialPage })`

---

## Git 提交规范

格式：`<type>: <subject>`

- `feat:` 新功能
- `fix:` 问题修复
- `chore:` 配置/工具链变更
- `refactor:` 重构（不改变功能）
- `style:` 样式调整

---

*由 CatPaw AI 自动生成，开发过程中根据实际情况更新。*
