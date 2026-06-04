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

实际已生成文件（截至 2026-06-04，共 51 个源文件）：

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
        readerStyles.ts           # ⭐ 从 ReaderScreen 拆分的样式集中文件
      hooks/
        useChapterNavigation.ts   # ⭐ 章节边界切换逻辑 Hook
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

- 必须配置：`windowSize={3}`、`maxToRenderPerBatch={2}`、`removeClippedSubviews={true}`
- 必须提供 `getItemLayout`（支持 `initialScrollIndex`）
- 使用 `expo-image` 而非 RN 原生 `Image`（更好的内存管理）
- `contentFit="fill"` 用于条漫（保留完整内容），`contentFit="cover"` 用于封面

**阅读器翻页模式（⭐ 2026-06-04 更新）：**

- 阅读器采用**水平翻页模式**：FlatList 开启 `horizontal` + `pagingEnabled`，向左滑进入下一页，向右滑返回上一页
- 每个 item 为一个 `ScrollView`（宽度 = `SCREEN_WIDTH`），内部放置单张条漫图片，图片高于屏幕时可在页内竖向滚动
- 图片高度不足屏幕高度时，下方补空白 `View`，避免分页显示错位
- `getItemLayout` 使用固定宽度（`SCREEN_WIDTH`）计算，不再需要动态累加高度偏移：
  ```typescript
  const getItemLayout = (_: unknown, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });
  ```

**`onViewableItemsChanged` 稳定引用规范：**

- `onViewableItemsChanged` 回调**必须用 `useRef` 包裹**，不能直接绑定会变化的函数引用
- 若直接传入 `useCallback` 返回值，FlatList 会在依赖变化时触发「Cannot update a component from inside the function body of a different component」警告并重建
- 正确模式：
  ```typescript
  // 将所有闭包依赖值存入 ref，避免陈旧值问题
  const saveProgressRef = useRef(saveProgressEntry);
  const mangaIdRef = useRef(mangaId);
  const chapterIdRef = useRef(chapterId);
  const pagesLengthRef = useRef(pages.length);
  useEffect(() => { saveProgressRef.current = saveProgressEntry; }, [saveProgressEntry]);
  useEffect(() => { mangaIdRef.current = mangaId; }, [mangaId]);
  useEffect(() => { chapterIdRef.current = chapterId; }, [chapterId]);
  useEffect(() => { pagesLengthRef.current = pages.length; }, [pages.length]);

  // onViewableItemsChanged 用 useRef 包裹，回调内通过 ref 读取最新值
  const onViewableRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length === 0) return;
    const minIndex = Math.min(...viewableItems.map((v) => v.index ?? 0));
    currentPageRef.current = minIndex;
    setCurrentPage(minIndex);
    // 通过 ref 读取最新依赖，无闭包陈旧值
    if (Math.abs(minIndex - lastSavedPageRef.current) >= SAVE_THROTTLE) {
      saveProgressRef.current(mangaIdRef.current, chapterIdRef.current, minIndex);
      lastSavedPageRef.current = minIndex;
    }
  });

  // FlatList 始终绑定 ref.current（稳定引用）
  <FlatList onViewableItemsChanged={onViewableRef.current} ... />
  ```

**章节边界切换实现模式（⭐ 2026-06-04 更新）：**

- 在 `pagingEnabled` 水平 FlatList 中，通过 `onScrollBeginDrag` + `onMomentumScrollEnd` 组合检测边界滑动并触发章节切换
- `onScrollBeginDrag`：记录当前页（`dragStartPageRef`）和是否正在拖动（`isDraggingRef = true`）
- `onMomentumScrollEnd`：计算滑动后的页码，若页码未变且处于第一页/最后一页，说明触达边界，弹出 Alert 提示切换上/下一章
- 防重入：`isAlertOpenRef` 标志位避免 Alert 重复弹出（用户多次滑动边界时）
- 导航使用 `navigation.replace` 而非 `navigation.push`，避免章节间来回切换导致导航栈无限累积
- 逻辑封装在 `src/screens/reader/hooks/useChapterNavigation.ts`，ReaderScreen 通过解构 Hook 返回值绑定到 FlatList props

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

### 🟠 SafeAreaView 必须从 react-native-safe-area-context 导入

- **现象**：页面顶部内容被 StatusBar 遮挡，Android 设备上尤为明显
- **原因**：`react-native` 内置的 `SafeAreaView` 在 Android 上不处理 StatusBar 高度，只处理 iOS notch；而 `react-native-safe-area-context` 的 `SafeAreaView` 在 Android/iOS 均正确计算安全区域
- **解决**：所有 Screen 级别组件统一从 `react-native-safe-area-context` 导入 `SafeAreaView`，项目已有此依赖（`react-native-safe-area-context@4.10.5`）
- **约束**：❌ 禁止从 `react-native` 直接导入 `SafeAreaView` 用于 Screen 级布局

### 🟠 expo-splash-screen 的 preventAutoHideAsync 必须在模块顶层调用

- **现象**：原生 Splash 在 JS bundle 加载完成后立即消失，用户看不到启动屏
- **原因**：`preventAutoHideAsync()` 必须在 JS 引擎加载模块时同步执行，若放在组件 `useEffect` 或函数体内，时机已晚，原生 Splash 可能已自动消失
- **解决**：在 `App.tsx` 所有 import 之后、组件定义之前，在模块顶层立即调用 `SplashScreen.preventAutoHideAsync()`；在根 View 的 `onLayout` 回调中调用 `SplashScreen.hideAsync()`
- **注意**：若 App.tsx 中有自定义组件也叫 `SplashScreen`，必须重命名（如 `LoadingScreen`）避免与 `import * as SplashScreen` 命名冲突
- **注意**：`isAppReady=false` 时不能 return null（onLayout 无法触发），应 return 空 `<View onLayout={onRootLayout} />`

### 🟠 `expo start --android` 在无 Expo Go 的模拟器上会卡住

- **现象**：运行 `expo start --android` 后终端卡住，App 无法在模拟器启动
- **原因**：`expo start` 依赖 Expo Go 客户端，模拟器若未安装 Expo Go 则无法 tunnel/LAN 连接
- **解决**：使用 `expo run:android`（原生编译模式），`package.json` 的 `android` script 已设置为此命令

### 🟡 阅读器水平翻页中 ScrollView 嵌套注意事项

- **现象**：水平 FlatList 内嵌套竖向 `ScrollView` 时，手势可能存在方向冲突
- **原因**：RN 手势系统默认会将水平滑动交给外层 FlatList，竖向滑动交给内层 ScrollView，两者方向不同时通常可自动区分
- **结论**：实际测试无冲突，水平翻页与竖向滚动可共存，无需额外配置 `nestedScrollEnabled`

### 🟠 `onViewableItemsChanged` 不能直接绑定会变化的函数引用

- **现象**：FlatList 的 `onViewableItemsChanged` prop 传入 `useCallback` 返回值，当依赖变化时出现 React 警告，进度更新异常
- **原因**：FlatList 内部要求 `onViewableItemsChanged` 引用稳定，不支持在渲染期间动态替换
- **解决**：将回调用 `useRef` 包裹，通过 `useEffect` 同步最新值，FlatList 始终绑定 ref（见 FlatList 性能规范章节）

### 🟡 Redux Persist + AsyncStorage 初始化时序问题

- **现象**：App 启动时 Redux store rehydrate 未完成，组件提前读取 store 拿到初始空值，导致书架/进度显示异常
- **原因**：`redux-persist` 的 rehydrate 是异步过程，若不等待完成直接渲染，组件会拿到未恢复的初始状态
- **解决**：`App.tsx` 必须用 `<PersistGate loading={<LoadingScreen />} persistor={persistor}>` 包裹根导航，等待 rehydrate 完成后再渲染

### 🟠 expo prebuild 会覆盖 values-v31/styles.xml 的手动修改

- **现象**：手动修改 `android/app/src/main/res/values-v31/styles.xml`（如配置 `windowSplashScreenAnimatedIcon`）后，再次执行 `expo prebuild` 时改动被覆盖还原
- **原因**：`expo prebuild` 会根据 `app.json` 配置重新生成原生 Android 模板文件，任何对 `android/` 目录内文件的手动修改均面临被覆盖的风险
- **解决**：有两种方案：① 编写 Expo Config Plugin（在 `app.json` 中 `plugins` 字段注册自定义插件），通过插件在 prebuild 后自动应用修改；② 若只做一次性修改，在每次 `expo prebuild` 后手动重新应用，并在项目 README/AGENTS.md 中记录补丁内容
- **约束**：❌ 不要依赖手动修改 `android/` 原生文件而不配套 Config Plugin，否则升级 Expo SDK 或团队成员执行 prebuild 后修改会丢失

### 🟠 Android 12+ 原生 Splash 去除 icon 放大动画

- **现象**：Android 12+（API 31+）原生 Splash 屏默认会将 App 图标以放大动画形式展示，与 App 设计风格不符，且图标边缘有白色背景圆形区域
- **原因**：Android 12 的 `SplashScreen` API 默认使用 `windowSplashScreenAnimatedIcon` 展示 App 图标，并自动添加背景和入场动画
- **解决**：在 `android/app/src/main/res/values-v31/styles.xml` 中，将 `windowSplashScreenAnimatedIcon` 设置为一个完全透明的 vector drawable（如 `@drawable/splash_icon_transparent`），并在 `drawable/splash_icon_transparent.xml` 中定义空的 `<vector>` 元素；同时设置 `windowSplashScreenBackground` 为品牌色（如 `#FEDFE8`），实现 Android 12+ 原生 Splash 阶段纯色背景、无图标放大动画的效果
- **注意**：此修改在 `values-v31/` 目录下生效（仅 Android 12+），不影响旧版 Android 行为；且每次 `expo prebuild` 后需重新应用（见上一条 Gotcha）

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

## 最近浏览展示规范

- `ProfileScreen` 的「最近浏览」列表按 `mangaId` 去重，每个作品只保留最新一条记录
- 去重逻辑在渲染时通过 `Set<string>` 过滤，不修改 Redux store 中的原始 `historyList`（store 保持全量记录）
- 每条展示：封面缩略图 + 作品标题 + 相对时间（不显示章节号）
- 最多展示 10 部（去重后取前 10）

---

## 阅读器章节切换规范

**触发时机：**

- **下一章**：在当前章节最后一页继续向左滑（pagingEnabled FlatList 到达末尾边界后继续拖动）
- **上一章**：在当前章节第一页继续向右滑（pagingEnabled FlatList 到达开头边界后继续拖动）

**实现组件：**

- 逻辑封装在 `src/screens/reader/hooks/useChapterNavigation.ts`
- Hook 接收 `{ pages, currentPage, mangaId, chapterId, navigation, allChapters }` 等参数
- 返回 `{ onScrollBeginDrag, onMomentumScrollEnd }` 供 FlatList 绑定

**防重入机制：**

- `isAlertOpenRef`：`useRef<boolean>`，Alert 弹出期间置为 `true`，Alert 关闭（用户确认或取消）后重置为 `false`，防止连续边界滑动多次弹出 Alert
- `isDraggingRef`：`useRef<boolean>`，拖动开始置为 `true`，`onMomentumScrollEnd` 触发后置为 `false`

**导航方式：**

- 使用 `navigation.replace('Reader', { mangaId, chapterId: nextChapterId, initialPage: 0 })` 而非 `navigation.push`
- 原因：`replace` 替换当前路由栈顶项，避免用户在多章节间来回切换时导航栈无限累积，导致返回键行为异常

**边界判断逻辑：**

```typescript
// onScrollBeginDrag：记录起始页
dragStartPageRef.current = currentPageRef.current;
isDraggingRef.current = true;

// onMomentumScrollEnd：判断页码是否变化
const newPage = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
if (newPage === dragStartPageRef.current) {
  // 页码未变 = 触达边界
  if (newPage === 0 && dragStartPageRef.current === 0) {
    // 右滑边界 → 提示上一章
  } else if (newPage === pages.length - 1) {
    // 左滑边界 → 提示下一章
  }
}
```

---

*由 CatPaw AI 自动生成，开发过程中根据实际情况更新。最后更新：2026-06-04（Splash修复+章节切换导航+readerStyles拆分+expo prebuild覆盖问题+Android 12+ Splash去动画）*
