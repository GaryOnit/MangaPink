# AGENTS.md — MangaPink AI 编码约束

> 本文件供 AI 编码助手（CatPaw 等）阅读，约束本项目的代码生成行为。

---

## 项目概述

**萌漫 MangaPink** — 二次元漫画阅读 App（原型阶段，纯前端 React Native + Expo）

- **技术栈**：React Native 0.74 + TypeScript + NativeWind v2 + Redux Toolkit + Expo SDK 51
- **设计风格**：粉白甜美二次元风
- **数据来源**：本地 Mock 数据，不依赖任何网络请求

---

## 目录结构约定

实际已生成文件（截至 2026-06-03，共 49 个源文件）：

```
src/
  screens/
    home/
      HomeScreen.tsx
      components/
        BannerCarousel.tsx
        MangaGrid.tsx
    shelf/
      ShelfScreen.tsx
      components/
        ShelfItem.tsx
    category/
      CategoryScreen.tsx
      components/
        CategoryGroup.tsx
    detail/
      MangaDetailScreen.tsx
      components/
        ChapterList.tsx
        MangaInfoSection.tsx      # ⭐ 从 MangaDetailScreen 拆分（行数控制）
    reader/
      ReaderScreen.tsx
      components/
        ReaderHeader.tsx          # ⭐ 从 ReaderScreen 拆分（行数控制）
        ReaderImage.tsx
        ReaderProgressBar.tsx
    profile/
      ProfileScreen.tsx
  components/                     # 全局公共组件（无状态/轻状态）
    ChapterItem.tsx
    EmptyState.tsx
    LoadingPlaceholder.tsx
    MangaCard.tsx
    MangaCover.tsx
    TagBadge.tsx
  navigation/
    BottomTabNavigator.tsx
    CategoryStack.tsx
    HomeStack.tsx
    ProfileStack.tsx
    RootNavigator.tsx
    ShelfStack.tsx
    types.ts
  store/
    hooks.ts
    index.ts
    selectors/
      bookshelfSelectors.ts
      historySelectors.ts
      readingProgressSelectors.ts
    slices/
      bookshelfSlice.ts
      historySlice.ts
      readingProgressSlice.ts
  hooks/
    useBookshelf.ts
    useHistory.ts
    useMangaData.ts
    useReadingProgress.ts
  data/
    assetMap.ts
    mockChapters.ts
    mockMangas.ts
  types/
    chapter.ts
    manga.ts
  utils/
    constants.ts
    formatters.ts
    storage.ts
  theme/
    colors.ts
    typography.ts
assets/
  covers/                         # 漫画封面图（PNG）
  chapters/                       # 条漫切片图（PNG），按 manga-xxx/ch-xx/page-xxx.png 组织
  icons/
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

> ⚠️ 本项目实际使用 **NativeWind v2**（`nativewind@^2.0.11`），非 v4。

**v2 正确配置方式：**

- `babel.config.js` 只需 `babel-preset-expo`，**不需要**添加 `nativewind/babel` preset
- `metro.config.js` 使用默认 `getDefaultConfig`，**不需要** `withNativeWind` wrapper
- `tailwind.config.js` **不需要** `presets: [require('nativewind/preset')]`（这是 v4 的配置）
- v2 **不使用** CSS runtime，`global.css` 文件虽存在（v4 时期遗留），但**未被任何文件 import**，可忽略

**样式使用规则：**

- 颜色使用 `tailwind.config.js` 中定义的自定义色板（如 `bg-pink-400`、`text-textPrimary`）
- ❌ 禁止使用 `animate-*`、`transition-*` 类（RN 不兼容，动效用 react-native-reanimated）
- 布局首选 `flex-1`、`flex-row`、`items-center` 等 Flex 类
- ❌ **禁止再次升级到 NativeWind v4**（v4 内置 react-native-worklets-core 需要 C++ NDK 编译，与 Expo SDK 51 不兼容）

---

## Redux 规范

- 每个 slice 文件对应单一关注点（bookshelf / readingProgress / history）
- Selector 统一放在 `store/selectors/` 目录，不在组件内写内联 selector
- Redux Persist 配置在 `store/index.ts` 中，每个 slice 独立 persist config
- Action 命名采用 camelCase（如 `addToBookshelf`、`updateProgress`）
- App.tsx 必须用 `PersistGate` 包裹 `RootNavigator`，避免 Redux Persist + AsyncStorage 初始化时序问题

---

## FlatList 性能规范（阅读器）

- 必须配置：`windowSize={5}`、`maxToRenderPerBatch={3}`、`removeClippedSubviews={true}`
- 必须提供 `getItemLayout`（支持 `initialScrollIndex`）
- 使用 `expo-image` 而非 RN 原生 `Image`（更好的内存管理）
- `contentFit="fill"` 用于条漫（保留完整内容），`contentFit="cover"` 用于封面

**动态高度 `getItemLayout` 实现要点：**

- 条漫每页高度不固定，须用 `useMemo` 预计算 `pageOffsets` 数组（累加各页实际高度）
- `getItemLayout` 直接查表返回 `{ length, offset, index }`，避免运行时重复计算
- 示例：
  ```typescript
  const pageOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    pages.forEach((p) => {
      offsets.push(acc);
      acc += (SCREEN_WIDTH / p.width) * p.height;
    });
    return offsets;
  }, [pages]);

  const getItemLayout = (_: unknown, index: number) => ({
    length: (SCREEN_WIDTH / pages[index].width) * pages[index].height,
    offset: pageOffsets[index] ?? 0,
    index,
  });
  ```

**`onViewableItemsChanged` 稳定引用规范：**

- `onViewableItemsChanged` 回调**必须用 `useRef` 包裹**，不能直接绑定会变化的函数引用
- 若直接传入 `useCallback` 返回值，FlatList 会在依赖变化时触发「Cannot update a component from inside the function body of a different component」警告并重建
- 正确模式：
  ```typescript
  const onViewableRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    // 通过 ref 访问最新的 dispatch / mangaId / chapterId
  });
  useEffect(() => {
    onViewableRef.current = ({ viewableItems }) => { /* ... */ };
  }, [dispatch, mangaId, chapterId, pages.length]);

  // FlatList 绑定
  <FlatList onViewableItemsChanged={onViewableRef.current} ... />
  ```

---

## 资源管理规范

- 所有 `require()` 调用集中在 `src/data/assetMap.ts` 中
- 其他文件通过 key 查表（`CoverAssets[mangaId]`、`ChapterAssets[assetKey]`）
- **`ChapterAssets` key 格式：`${mangaId}_${chapterId}`**（例如 `'manga-001_ch-01'`）
- 图片命名规范：小写 + 连字符，如 `manga-001.png`、`manga-001/ch-01/page-001.png`
- ❌ 禁止动态拼接 `require()` 路径（Metro bundler 静态分析限制）
- `assetMap.ts` 中 `ChapterAssets` 每项存储 `{ source, width, height }` 元数据，供 `getItemLayout` 使用

---

## 导航规范

- 每个 Tab 有独立的 Stack（`HomeStack` / `ShelfStack` / `CategoryStack` / `ProfileStack`）
- `MangaDetailScreen` 和 `ReaderScreen` 在每个 Stack 内独立注册（避免跨 Tab 栈混乱）
- Navigation 参数类型定义在 `navigation/types.ts`
- 进入 ReaderScreen 时需通过 `navigation.push('Reader', { mangaId, chapterId, initialPage })`

---

## 已知坑（Gotchas）

> 开发过程中实际踩到的问题，后续 AI 生成代码时需规避。

### 🔴 NativeWind v4 与 Expo SDK 51 不兼容

- **现象**：安装 `nativewind@^4.0.36` 后，构建时报 `react-native-worklets-core` 需要 C++ NDK 编译错误
- **原因**：NativeWind v4 内置依赖 `react-native-worklets-core`，该库需要原生编译，Expo Managed Workflow + SDK 51 不支持
- **解决**：降级到 `nativewind@^2.0.11`，移除 `nativewind/babel` 和 `withNativeWind` 配置
- **约束**：❌ 禁止再次升级到 NativeWind v4，除非同步升级到 Expo SDK 53+ 并切换到 Bare Workflow

### 🟠 `expo start --android` 在无 Expo Go 的模拟器上会卡住

- **现象**：运行 `expo start --android` 后终端卡住，App 无法在模拟器启动
- **原因**：`expo start` 依赖 Expo Go 客户端，模拟器若未安装 Expo Go 则无法 tunnel/LAN 连接
- **解决**：使用 `expo run:android`（原生编译模式），`package.json` 的 `android` script 已设置为此命令

### 🟠 `onViewableItemsChanged` 不能直接绑定会变化的函数引用

- **现象**：FlatList 的 `onViewableItemsChanged` prop 传入 `useCallback` 返回值，当依赖变化时出现 React 警告，进度更新异常
- **原因**：FlatList 内部要求 `onViewableItemsChanged` 引用稳定，不支持在渲染期间动态替换
- **解决**：将回调用 `useRef` 包裹，通过 `useEffect` 同步最新值，FlatList 始终绑定 ref（见 FlatList 性能规范章节）

### 🟡 Redux Persist + AsyncStorage 初始化时序问题

- **现象**：App 启动时 Redux store rehydrate 未完成，组件提前读取 store 拿到初始空值，导致书架/进度显示异常
- **原因**：`redux-persist` 的 rehydrate 是异步过程，若不等待完成直接渲染，组件会拿到未恢复的初始状态
- **解决**：`App.tsx` 必须用 `<PersistGate loading={<LoadingScreen />} persistor={persistor}>` 包裹根导航，等待 rehydrate 完成后再渲染

---

## Git 提交规范

格式：`<type>: <subject>`

- `feat:` 新功能
- `fix:` 问题修复
- `chore:` 配置/工具链变更
- `refactor:` 重构（不改变功能）
- `style:` 样式调整
- `docs:` 文档/知识库更新

---

*由 CatPaw AI 自动生成，开发过程中根据实际情况更新。最后更新：2026-06-03（Phase 4 知识库同步）*
