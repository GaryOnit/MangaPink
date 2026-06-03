# 萌漫 MangaPink 技术评审文档

**版本**：v1.1  
**日期**：2026-06-03  
**评审人**：高级前端架构师（AI）  
**项目阶段**：原型阶段（本地纯前端）  
**文档状态**：v1.1（已交叉复核，修正 8 处问题）

---

## 1. 技术架构设计

### 1.1 项目目录结构

```
manga_app/
├── src/
│   ├── screens/                    # 页面级组件
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── components/         # 首页私有子组件
│   │   │       ├── BannerCarousel.tsx
│   │   │       └── MangaGrid.tsx
│   │   ├── shelf/
│   │   │   ├── ShelfScreen.tsx
│   │   │   └── components/
│   │   │       └── ShelfItem.tsx
│   │   ├── category/
│   │   │   ├── CategoryScreen.tsx
│   │   │   └── components/
│   │   │       └── CategoryGroup.tsx
│   │   ├── detail/
│   │   │   ├── MangaDetailScreen.tsx
│   │   │   └── components/
│   │   │       └── ChapterList.tsx
│   │   ├── reader/
│   │   │   ├── ReaderScreen.tsx
│   │   │   └── components/
│   │   │       ├── ReaderImage.tsx
│   │   │       └── ReaderProgressBar.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── components/                 # 全局公共组件
│   │   ├── MangaCover.tsx
│   │   ├── MangaCard.tsx
│   │   ├── ChapterItem.tsx
│   │   ├── TagBadge.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingPlaceholder.tsx
│   ├── navigation/                 # 导航配置
│   │   ├── RootNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   ├── HomeStack.tsx
│   │   ├── ShelfStack.tsx
│   │   ├── CategoryStack.tsx
│   │   ├── ProfileStack.tsx        # ✅ 补充（复核修正）
│   │   └── types.ts                # 导航类型定义
│   ├── store/                      # Redux 状态管理
│   │   ├── index.ts                # store 配置 + persistor
│   │   ├── hooks.ts                # useAppDispatch / useAppSelector
│   │   ├── slices/
│   │   │   ├── bookshelfSlice.ts
│   │   │   ├── readingProgressSlice.ts
│   │   │   └── historySlice.ts
│   │   └── selectors/
│   │       ├── bookshelfSelectors.ts
│   │       ├── readingProgressSelectors.ts
│   │       └── historySelectors.ts  # ✅ 补充（复核修正）
│   ├── hooks/                      # 自定义 Hook
│   │   ├── useBookshelf.ts
│   │   ├── useReadingProgress.ts
│   │   ├── useHistory.ts            # ✅ 补充（复核修正）
│   │   └── useMangaData.ts
│   ├── data/                       # Mock 数据与数据类型
│   │   ├── mockMangas.ts
│   │   ├── mockChapters.ts
│   │   └── assetMap.ts             # 本地 assets 路径映射表（含 width/height 元数据）
│   ├── types/                      # 全局 TypeScript 类型
│   │   ├── manga.ts
│   │   └── chapter.ts              # ✅ 独立拆分（复核修正，避免与 navigation/types.ts 职责重叠）
│   ├── utils/                      # 工具函数
│   │   ├── storage.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   └── theme/                      # 主题配置（配合 NativeWind）
│       ├── colors.ts
│       └── typography.ts
├── assets/                         # 本地静态资源
│   ├── covers/                     # 漫画封面图（300×400 WebP）
│   │   ├── manga-001.webp
│   │   └── ...
│   ├── chapters/                   # 条漫切片图
│   │   ├── manga-001/
│   │   │   ├── ch-01/
│   │   │   │   ├── page-001.webp
│   │   │   │   └── ...
│   │   │   └── ch-02/
│   │   └── ...
│   └── icons/                      # 自定义图标 SVG/PNG
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── global.css                      # NativeWind 全局 CSS 入口
├── app.json
└── App.tsx                         # 入口：Provider + PersistGate + Navigator
```

> **分层原则**：screens 负责业务编排，components 负责 UI 表现，store 负责状态，hooks 封装业务逻辑，data 提供静态数据源。单文件不超过 200 行，超出则拆分私有子组件。

### 1.2 核心模块划分

| 模块 | 职责 | 关键文件 |
|------|------|---------|
| **screens** | 页面级容器，组合子组件，绑定 store | `HomeScreen`、`ShelfScreen`、`CategoryScreen`、`ReaderScreen`、`MangaDetailScreen`、`ProfileScreen` |
| **components** | 无状态/轻状态可复用 UI 原子组件 | `MangaCover`、`MangaCard`、`ChapterItem`、`TagBadge`、`EmptyState` |
| **navigation** | 路由配置、类型安全导航 | `RootNavigator`、`BottomTabNavigator`、各 Stack |
| **store** | Redux 状态树、slice、selector | `bookshelfSlice`、`readingProgressSlice`、`historySlice` |
| **hooks** | 封装 store 读写逻辑、业务副作用 | `useBookshelf`、`useReadingProgress`、`useHistory`、`useMangaData` |
| **data** | Mock 数据与资源映射表 | `mockMangas`、`assetMap` |
| **types** | 全局 TypeScript 接口/类型 | `Manga`、`Chapter`、`ReadingProgress` |
| **utils** | 纯函数工具集 | `formatters`、`constants` |
| **theme** | 颜色、字体常量（TypeScript 侧） | `colors`、`typography` |
| **assets** | 封面图、条漫切片图、图标 | WebP 静态资源 |

### 1.3 数据流设计

#### Redux Store 整体结构

```typescript
// store/index.ts
interface RootState {
  bookshelf: BookshelfState;
  readingProgress: ReadingProgressState;
  history: HistoryState;
}
```

#### bookshelfSlice

```typescript
// store/slices/bookshelfSlice.ts
interface BookshelfItem {
  mangaId: string;
  addedAt: number;           // 收藏时间戳（ms）
  latestChapterId: string;   // 收藏时最新话（用于显示更新状态）
}

interface BookshelfState {
  items: BookshelfItem[];    // 书架列表（有序）
}

// Actions
// addToBookshelf(mangaId)
// removeFromBookshelf(mangaId)
// updateLatestChapter({ mangaId, chapterId })
```

#### readingProgressSlice

```typescript
// store/slices/readingProgressSlice.ts
interface ReadingProgress {
  mangaId: string;
  chapterId: string;
  pageIndex: number;          // 当前阅读到的图片 index（FlatList viewableIndex）
  totalPages: number;
  updatedAt: number;          // 最后更新时间戳（ms）
}

interface ReadingProgressState {
  progressMap: Record<string, ReadingProgress>;  // key: mangaId
}

// Actions
// updateProgress({ mangaId, chapterId, pageIndex, totalPages })
// clearProgress(mangaId)
```

#### historySlice

```typescript
// store/slices/historySlice.ts
interface HistoryRecord {
  mangaId: string;
  visitedAt: number;           // 访问时间戳（ms）
}

interface HistoryState {
  records: HistoryRecord[];    // 最多保留 50 条，按 visitedAt 降序
}

// Actions
// addHistory(mangaId)
// clearHistory()
```

#### 数据流向图

```
用户操作
  ↓
Screen / Hook
  ↓ dispatch action
Redux Store（bookshelf / readingProgress / history）
  ↓ Redux Persist（持久化）
AsyncStorage（本地存储）
  ↑ rehydrate（App 重启时恢复）
Redux Store
  ↓ selector
Screen / Component（re-render）
```

---

## 2. 关键技术方案

### 2.1 React Navigation 6 导航方案

#### 导航层级设计

```
RootNavigator（Stack）
  ├── BottomTabNavigator（底部四 Tab）
  │   ├── HomeStack（Stack）
  │   │   ├── HomeScreen（首页）
  │   │   ├── MangaDetailScreen（漫画详情）
  │   │   └── ReaderScreen（阅读器）
  │   ├── ShelfStack（Stack）
  │   │   ├── ShelfScreen（书架）
  │   │   ├── MangaDetailScreen（漫画详情）
  │   │   └── ReaderScreen（阅读器）
  │   ├── CategoryStack（Stack）
  │   │   ├── CategoryScreen（分类）
  │   │   ├── MangaDetailScreen（漫画详情）
  │   │   └── ReaderScreen（阅读器）
  │   └── ProfileStack（Stack）
  │       └── ProfileScreen（我的）
  └── （Modal 层，可选）
      └── ProgressModal（进度提示弹层）
```

> **设计决策**：`MangaDetailScreen` 和 `ReaderScreen` 在每个 Tab 的 Stack 内各自独立注册，避免跨 Tab 导航栈混乱，同时保证 Tab 切换后返回键行为符合预期。

#### 类型安全导航

```typescript
// navigation/types.ts
export type HomeStackParamList = {
  Home: undefined;
  MangaDetail: { mangaId: string };
  Reader: { mangaId: string; chapterId: string; initialPage?: number };
};

export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ShelfTab: NavigatorScreenParams<ShelfStackParamList>;
  CategoryTab: NavigatorScreenParams<CategoryStackParamList>;
  ProfileTab: undefined;
};
```

#### 底部 Tab 配置要点

- 使用 `@react-navigation/bottom-tabs` 的 `createBottomTabNavigator`
- 自定义 `tabBarStyle` 注入 NativeWind 粉白主题（背景白色、选中态粉色）
- Tab 图标使用 `react-native-vector-icons` 或内联 SVG 资源
- `ReaderScreen` 进入时通过 `tabBarStyle: { display: 'none' }` 隐藏底部 Tab，实现沉浸式阅读

### 2.2 NativeWind v4 主题配置方案

#### tailwind.config.js

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 主色调——粉色系
        pink: {
          50:  '#FFF0F5',   // 最浅背景
          100: '#FFD6E7',
          200: '#FFB3D1',   // 封面角标、淡底
          300: '#FF8DB8',
          400: '#FF6B9D',   // 主品牌色（按钮、选中态）
          500: '#FF4785',
          600: '#E91E8C',   // 深强调（重要文字、徽章）
          700: '#C2006F',
          800: '#9A0057',
          900: '#720042',
        },
        // 中性色（保留白色系）
        surface: '#FFFFFF',
        background: '#FFF0F5',  // 全局背景浅粉灰
        card: '#FFFFFF',
        border: '#FFD6E7',
        textPrimary: '#2D1B2E',   // 深紫黑，保持可读性
        textSecondary: '#A0608A', // 中粉灰
        textDisabled: '#D4B0C5',
      },
      fontFamily: {
        // 圆润字体（需安装字体文件）
        round: ['NotoSansRounded', 'System'],
      },
      borderRadius: {
        // ✅ 复核修正：RN 中 borderRadius 值为数字，NativeWind 会正确转换
        card: '12',
        btn: '8',
        tag: '4',
      },
      spacing: {
        // NativeWind spacing 基础单位为 4px，以下为自定义命名映射
        'card-gap': '3',          // 12px = 3 × 4px
        'screen-padding': '4',    // 16px = 4 × 4px
      },
    },
  },
  plugins: [],
};
```

#### NativeWind v4 集成要点

1. **babel.config.js** 中添加 `'nativewind/babel'` preset
2. **metro.config.js** 中配置 `withNativeWind`，指定 CSS 入口文件
3. 全局入口（`App.tsx`）导入 `global.css`（包含 `@tailwind base/components/utilities`）
4. 为支持 TypeScript 类名提示，安装 `nativewind` 类型包并在 `tsconfig.json` 中引用

#### 典型样式用法

```tsx
// 漫画卡片示例
<View className="bg-card rounded-card p-3 mx-1 shadow-sm">
  <Image className="w-full aspect-[3/4] rounded-[8px]" />
  <Text className="text-textPrimary font-round text-sm mt-2 font-semibold">
    标题
  </Text>
  <View className="flex-row flex-wrap gap-1 mt-1">
    <View className="bg-pink-100 rounded-tag px-2 py-0.5">
      <Text className="text-pink-600 text-xs">恋爱</Text>
    </View>
  </View>
</View>
```

### 2.3 FlatList 条漫阅读器方案

#### 核心参数配置

```typescript
// screens/reader/ReaderScreen.tsx
const WINDOW_SIZE = 5;            // 可视区域上下各保留 2 屏图片（共 5 屏）
const MAX_TO_RENDER = 3;          // 每批最多渲染 3 张
const INITIAL_NUM = 3;            // 首屏预渲染 3 张
// ✅ 复核修正：updateCellsBatchingPeriod 含义为「批量渲染时间间隔（ms）」，非「onEndReached 提前量」
const UPDATE_CELLS_BATCH = 50;    // 批量渲染的时间间隔（ms），默认 50ms，控制渲染任务调度频率

<FlatList
  data={pages}
  keyExtractor={(item) => item.id}
  renderItem={renderPage}
  // 性能调优参数
  windowSize={WINDOW_SIZE}
  maxToRenderPerBatch={MAX_TO_RENDER}
  initialNumToRender={INITIAL_NUM}
  updateCellsBatchingPeriod={UPDATE_CELLS_BATCH}  // 批量渲染时间间隔（ms）
  removeClippedSubviews={true}          // Android 必须开启
  // 进度追踪
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
  // 初始滚动位置（恢复阅读进度）
  initialScrollIndex={initialPage}
  getItemLayout={getItemLayout}         // 必须提供，initialScrollIndex 依赖
  // 其他
  showsVerticalScrollIndicator={false}
  bounces={false}
/>
```

#### 阅读进度追踪实现

```typescript
const viewabilityConfig = useRef<ViewabilityConfig>({
  viewAreaCoveragePercentThreshold: 50,  // 超过 50% 可视才算「已读」
  minimumViewTime: 300,                  // 至少停留 300ms 才触发回调
});

const onViewableItemsChanged = useCallback(
  ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const lastVisible = viewableItems[viewableItems.length - 1];
      dispatch(updateProgress({
        mangaId,
        chapterId,
        pageIndex: lastVisible.index ?? 0,
        totalPages: pages.length,
      }));
    }
  },
  [dispatch, mangaId, chapterId, pages.length]
);
```

#### getItemLayout 实现（关键性能优化）

由于条漫图片高度各异，需要预先计算每张图片的布局高度：

```typescript
// 方案 A：固定宽高比（适合条漫规格统一的场景）
const SCREEN_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = SCREEN_WIDTH * (16 / 9);  // 或从 assetMap 读取各图片实际比例

const getItemLayout = (_: unknown, index: number) => ({
  length: PAGE_HEIGHT,
  offset: PAGE_HEIGHT * index,
  index,
});

// 方案 B：动态高度（精准，需在 assetMap 中预存图片尺寸）
// assetMap.ts 中存储 { width, height } 元数据
// getItemLayout 从映射表取实际高度并累加 offset
```

> **推荐方案 B**：在 `assetMap.ts` 中预存每张图片的 `{ width, height }`，`getItemLayout` 基于此计算，支持 `initialScrollIndex` 精准跳转。

#### 图片渲染组件

```typescript
// screens/reader/components/ReaderImage.tsx
import { Image } from 'expo-image';  // 推荐 expo-image（支持 RN 新架构 + 内存缓存）

const ReaderImage = ({ source, width, height }: Props) => (
  <Image
    source={source}
    style={{ width, height }}
    // ✅ 复核修正：条漫应铺满宽度显示完整内容，使用 fill 而非 cover（cover 会裁切图片）
    contentFit="fill"
    placeholder={blurhash}           // 加载占位符（模糊效果）
    transition={150}                 // 渐显动效
    recyclingKey={source}            // FlatList 复用时强制重置
  />
);
```

### 2.4 Redux Toolkit + Redux Persist 持久化方案

#### store/index.ts 完整配置

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookshelfReducer from './slices/bookshelfSlice';
import readingProgressReducer from './slices/readingProgressSlice';
import historyReducer from './slices/historySlice';

// 持久化配置（按 slice 分级）
const bookshelfPersistConfig = {
  key: 'bookshelf',
  version: 1,
  storage: AsyncStorage,
};

const readingProgressPersistConfig = {
  key: 'readingProgress',
  version: 1,
  storage: AsyncStorage,
};

const historyPersistConfig = {
  key: 'history',
  version: 1,
  storage: AsyncStorage,
  // 最多持久化 50 条历史记录（通过 transforms 实现）
};

const rootReducer = combineReducers({
  bookshelf: persistReducer(bookshelfPersistConfig, bookshelfReducer),
  readingProgress: persistReducer(readingProgressPersistConfig, readingProgressReducer),
  history: persistReducer(historyPersistConfig, historyReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 内部 action
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

#### App.tsx 根组件集成

```typescript
// App.tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
```

#### 持久化数据结构版本管理

- 每个 `persistConfig` 设置 `version` 字段
- 配套实现 `migrate` 函数，当 `version` 升级时迁移旧数据结构
- `bookshelf` 和 `readingProgress` 是核心持久化数据，`history` 为可选

### 2.5 本地 Assets 资源管理方案

#### assetMap.ts 设计

```typescript
// src/data/assetMap.ts
// 集中管理所有本地图片引用，避免分散 require() 导致的路径管理混乱

export const CoverAssets: Record<string, ImageSourcePropType> = {
  'manga-001': require('../../assets/covers/manga-001.webp'),
  'manga-002': require('../../assets/covers/manga-002.webp'),
  // ... 10 部漫画封面
};

export interface PageMeta {
  source: ImageSourcePropType;
  width: number;    // 原始宽度（px）
  height: number;   // 原始高度（px）
}

// 章节图片映射：key 格式 = `{mangaId}_{chapterId}`
export const ChapterAssets: Record<string, PageMeta[]> = {
  'manga-001_ch-01': [
    { source: require('../../assets/chapters/manga-001/ch-01/page-001.webp'), width: 720, height: 1280 },
    { source: require('../../assets/chapters/manga-001/ch-01/page-002.webp'), width: 720, height: 1600 },
    // ...
  ],
  // ...
};
```

#### Mock 数据结构设计

```typescript
// src/types/manga.ts
export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  tags: string[];           // 例如 ['恋爱', '日常', '治愈']
  status: 'ongoing' | 'completed';
  latestChapter: string;    // 例如 '第12话'
  totalChapters: number;
  coverId: string;          // 对应 CoverAssets key
  rating: number;           // 1-5
}

// src/types/chapter.ts（独立拆分，复核修正）
export interface Chapter {
  id: string;
  mangaId: string;
  index: number;            // 话数序号（从 1 开始）
  title: string;            // 例如 '第1话：邂逅'
  pageCount: number;
  assetKey: string;         // 对应 ChapterAssets key
}

// src/data/mockMangas.ts — 10 部漫画 mock 数据
// src/data/mockChapters.ts — 对应话数数据（每部 2-3 话）
```

---

## 3. 组件拆分设计

### 3.1 页面级组件

| 组件 | 路径 | 职责 | 关键依赖 |
|------|------|------|---------|
| `HomeScreen` | `screens/home/HomeScreen.tsx` | 推荐 Banner + 漫画网格，首页入口 | `useMangaData`、`MangaCard` |
| `ShelfScreen` | `screens/shelf/ShelfScreen.tsx` | 展示用户书架列表及阅读进度 | `useBookshelf`、`useReadingProgress` |
| `CategoryScreen` | `screens/category/CategoryScreen.tsx` | 分类标签导航 + 漫画列表 | `useMangaData`、`MangaCard` |
| `MangaDetailScreen` | `screens/detail/MangaDetailScreen.tsx` | 漫画详情、简介、话数列表 | `useBookshelf`、`useHistory`、`ChapterItem` |
| `ReaderScreen` | `screens/reader/ReaderScreen.tsx` | 核心阅读器，FlatList 条漫长滚动 | `useReadingProgress`、`ReaderImage` |
| `ProfileScreen` | `screens/profile/ProfileScreen.tsx` | 我的页面（阶段二扩展） | — |

### 3.2 公共组件

| 组件 | 路径 | Props | 职责 |
|------|------|-------|------|
| `MangaCover` | `components/MangaCover.tsx` | `mangaId: string`, `size: 'sm'｜'md'｜'lg'` | 封面图展示，封装 expo-image |
| `MangaCard` | `components/MangaCard.tsx` | `manga: Manga`, `onPress: () => void` | 漫画卡片（封面+标题+标签），用于首页/分类页网格 |
| `ChapterItem` | `components/ChapterItem.tsx` | `chapter: Chapter`, `isRead: boolean`, `onPress: () => void` | 单话列表项，显示话数标题和阅读状态 |
| `ReaderImage` | `screens/reader/components/ReaderImage.tsx` | `pageMeta: PageMeta`, `width: number` | 阅读器单页图片，使用 expo-image，`contentFit="fill"` |
| `TagBadge` | `components/TagBadge.tsx` | `tag: string`, `variant: 'outline'｜'filled'` | 标签徽章（恋爱/热血/日常等） |
| `EmptyState` | `components/EmptyState.tsx` | `title: string`, `subtitle?: string`, `icon?: ReactNode` | 书架空状态、分类无结果等空状态组件 |
| `LoadingPlaceholder` | `components/LoadingPlaceholder.tsx` | `count?: number` | 骨架屏占位（漫画卡片加载中） |
| `ReaderProgressBar` | `screens/reader/components/ReaderProgressBar.tsx` | `current: number`, `total: number` | 阅读器底部进度指示条 |

### 3.3 自定义 Hook

#### useBookshelf

```typescript
// hooks/useBookshelf.ts
export function useBookshelf() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBookshelfItems);
  const mangaIds = useAppSelector(selectBookshelfMangaIds);

  const isInBookshelf = useCallback((mangaId: string) => mangaIds.includes(mangaId), [mangaIds]);
  const addToShelf = useCallback((mangaId: string) => dispatch(addToBookshelf(mangaId)), [dispatch]);
  const removeFromShelf = useCallback((mangaId: string) => dispatch(removeFromBookshelf(mangaId)), [dispatch]);

  return { items, isInBookshelf, addToShelf, removeFromShelf };
}
```

#### useReadingProgress

```typescript
// hooks/useReadingProgress.ts
export function useReadingProgress(mangaId: string) {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => selectProgressByMangaId(state, mangaId));

  const saveProgress = useCallback(
    (chapterId: string, pageIndex: number, totalPages: number) => {
      dispatch(updateProgress({ mangaId, chapterId, pageIndex, totalPages }));
    },
    [dispatch, mangaId]
  );

  return { progress, saveProgress };
}
```

#### useHistory（✅ 复核补充）

```typescript
// hooks/useHistory.ts
export function useHistory() {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectHistoryRecords);

  const recordVisit = useCallback(
    (mangaId: string) => dispatch(addHistory(mangaId)),
    [dispatch]
  );

  const clearAll = useCallback(() => dispatch(clearHistory()), [dispatch]);

  return { records, recordVisit, clearAll };
}
```

#### useMangaData

```typescript
// hooks/useMangaData.ts
export function useMangaData() {
  // 从 mockMangas / mockChapters 中过滤、排序、分类
  const getMangaById = useCallback((id: string): Manga | undefined => {
    return mockMangas.find((m) => m.id === id);
  }, []);

  const getMangasByTag = useCallback((tag: string): Manga[] => {
    return mockMangas.filter((m) => m.tags.includes(tag));
  }, []);

  const getChaptersByMangaId = useCallback((mangaId: string): Chapter[] => {
    return mockChapters.filter((c) => c.mangaId === mangaId);
  }, []);

  const getPagesByChapter = useCallback((assetKey: string): PageMeta[] => {
    return ChapterAssets[assetKey] ?? [];
  }, []);

  return { mangas: mockMangas, getMangaById, getMangasByTag, getChaptersByMangaId, getPagesByChapter };
}
```

---

## 4. 改动范围与工作量评估

### 4.1 文件级别新建清单

共需新建 **57 个文件**，分布如下：

> **复核修正说明**：相比初稿新增 3 个文件：`ProfileStack.tsx`（导航层补全）、`historySelectors.ts`（selector 对称补全）、`useHistory.ts`（Hook 层对称补全）；`src/types/navigation.ts` 调整为 `chapter.ts`（避免与 `navigation/types.ts` 职责重叠）。

#### 工程配置（6 个文件）

| # | 文件路径 | 说明 |
|---|---------|------|
| 1 | `App.tsx` | 入口文件（Provider + PersistGate + Navigator） |
| 2 | `tailwind.config.js` | NativeWind v4 主题配置 |
| 3 | `babel.config.js` | Babel 配置（nativewind/babel preset） |
| 4 | `metro.config.js` | Metro 配置（withNativeWind） |
| 5 | `tsconfig.json` | TypeScript 严格模式配置 |
| 6 | `global.css` | NativeWind 全局 CSS 入口 |

#### 导航层（7 个文件，✅ 复核修正）

| # | 文件路径 | 说明 |
|---|---------|------|
| 7 | `src/navigation/RootNavigator.tsx` | 根导航容器 |
| 8 | `src/navigation/BottomTabNavigator.tsx` | 底部 Tab 导航 |
| 9 | `src/navigation/HomeStack.tsx` | 首页 Stack |
| 10 | `src/navigation/ShelfStack.tsx` | 书架 Stack |
| 11 | `src/navigation/CategoryStack.tsx` | 分类 Stack |
| 12 | `src/navigation/ProfileStack.tsx` | 我的 Stack（✅ 补充，与导航层级图对齐） |
| 13 | `src/navigation/types.ts` | 导航类型定义 |

#### 状态管理（8 个文件，✅ 复核修正）

| # | 文件路径 | 说明 |
|---|---------|------|
| 14 | `src/store/index.ts` | Store 配置 + persistor |
| 15 | `src/store/hooks.ts` | `useAppDispatch` / `useAppSelector` typed hooks |
| 16 | `src/store/slices/bookshelfSlice.ts` | 书架 slice |
| 17 | `src/store/slices/readingProgressSlice.ts` | 阅读进度 slice |
| 18 | `src/store/slices/historySlice.ts` | 历史记录 slice |
| 19 | `src/store/selectors/bookshelfSelectors.ts` | 书架 selector |
| 20 | `src/store/selectors/readingProgressSelectors.ts` | 进度 selector |
| 21 | `src/store/selectors/historySelectors.ts` | 历史 selector（✅ 补充，与 historySlice 对称） |

#### 页面组件（11 个文件）

| # | 文件路径 | 说明 |
|---|---------|------|
| 22 | `src/screens/home/HomeScreen.tsx` | 首页 |
| 23 | `src/screens/home/components/BannerCarousel.tsx` | 首页轮播 Banner |
| 24 | `src/screens/home/components/MangaGrid.tsx` | 首页漫画网格 |
| 25 | `src/screens/shelf/ShelfScreen.tsx` | 书架页 |
| 26 | `src/screens/shelf/components/ShelfItem.tsx` | 书架单项 |
| 27 | `src/screens/category/CategoryScreen.tsx` | 分类页 |
| 28 | `src/screens/category/components/CategoryGroup.tsx` | 分类组 |
| 29 | `src/screens/detail/MangaDetailScreen.tsx` | 漫画详情页 |
| 30 | `src/screens/detail/components/ChapterList.tsx` | 话数列表 |
| 31 | `src/screens/reader/ReaderScreen.tsx` | 阅读器页 |
| 32 | `src/screens/profile/ProfileScreen.tsx` | 我的页 |

#### 阅读器子组件（2 个文件）

| # | 文件路径 | 说明 |
|---|---------|------|
| 33 | `src/screens/reader/components/ReaderImage.tsx` | 阅读器图片组件（contentFit="fill"） |
| 34 | `src/screens/reader/components/ReaderProgressBar.tsx` | 进度指示条 |

#### 公共组件（6 个文件）

| # | 文件路径 | 说明 |
|---|---------|------|
| 35 | `src/components/MangaCover.tsx` | 漫画封面 |
| 36 | `src/components/MangaCard.tsx` | 漫画卡片 |
| 37 | `src/components/ChapterItem.tsx` | 话数列表项 |
| 38 | `src/components/TagBadge.tsx` | 标签徽章 |
| 39 | `src/components/EmptyState.tsx` | 空状态 |
| 40 | `src/components/LoadingPlaceholder.tsx` | 骨架屏 |

#### 自定义 Hook（4 个文件，✅ 复核修正）

| # | 文件路径 | 说明 |
|---|---------|------|
| 41 | `src/hooks/useBookshelf.ts` | 书架 Hook |
| 42 | `src/hooks/useReadingProgress.ts` | 阅读进度 Hook |
| 43 | `src/hooks/useHistory.ts` | 追漫历史 Hook（✅ 补充，historySlice 封装入口） |
| 44 | `src/hooks/useMangaData.ts` | Mock 数据 Hook |

#### 数据与类型（7 个文件，✅ 复核修正）

| # | 文件路径 | 说明 |
|---|---------|------|
| 45 | `src/data/mockMangas.ts` | 10 部 Mock 漫画数据 |
| 46 | `src/data/mockChapters.ts` | Mock 话数数据（共 20-30 话） |
| 47 | `src/data/assetMap.ts` | 本地图片资源映射表（含 width/height 元数据） |
| 48 | `src/types/manga.ts` | Manga 接口类型 |
| 49 | `src/types/chapter.ts` | Chapter 接口类型（✅ 独立拆分，与目录结构一致） |
| 50 | `src/theme/colors.ts` | 颜色常量（TS 侧引用） |
| 51 | `src/theme/typography.ts` | 字体常量 |

#### 工具函数（3 个文件）

| # | 文件路径 | 说明 |
|---|---------|------|
| 52 | `src/utils/constants.ts` | 全局常量（屏幕尺寸等） |
| 53 | `src/utils/formatters.ts` | 格式化工具（时间、进度显示） |
| 54 | `src/utils/storage.ts` | AsyncStorage 封装（migration 逻辑） |

#### 测试文件（3 个文件，初期）

| # | 文件路径 | 说明 |
|---|---------|------|
| 55 | `src/store/slices/__tests__/bookshelfSlice.test.ts` | 书架 slice 单测 |
| 56 | `src/store/slices/__tests__/readingProgressSlice.test.ts` | 进度 slice 单测 |
| 57 | `src/hooks/__tests__/useReadingProgress.test.ts` | 进度 Hook 单测 |

### 4.2 各模块工作量（人天）

| 模块 | 工作量（人天） | 备注 |
|------|-------------|------|
| M0 工程初始化（脚手架 + 依赖 + 配置） | 0.5 | RN CLI / Expo 初始化，NativeWind/Redux 接入 |
| Mock 数据制作（图片素材 + 数据结构） | 1.0 | 找图/制作封面 10 张 + 条漫图片 ~200 张，数据 JSON 编写 |
| 导航骨架 | 0.5 | Tab + Stack 层级搭建，类型定义 |
| 首页 UI | 1.5 | Banner 轮播 + 漫画网格，粉白风格 |
| 书架页 UI | 1.0 | 列表展示 + 阅读进度显示 |
| 分类页 UI | 1.0 | 分类标签 + 漫画列表 |
| 漫画详情页 | 1.0 | 详情信息 + 话数列表 |
| 阅读器核心（FlatList + 进度追踪） | 2.0 | 最复杂模块，含调优 |
| Redux Store 设计（3 个 slice + persist） | 1.0 | 含类型设计和 Hook 封装 |
| 公共组件库 | 1.0 | MangaCover、MangaCard、TagBadge 等 |
| 联调打磨（动效、SafeArea、兼容性） | 1.5 | |
| 单元测试（Slice + Hook） | 1.0 | |
| **合计** | **13.0 人天** | 约 2.5 - 3 周（0.8 效率系数） |

### 4.3 CheckPoint 拆分方案（5 个 CP）

| CheckPoint | 里程碑对应 | 交付内容 | 验收标准 |
|-----------|----------|---------|---------|
| **CP1：工程骨架 Ready** | M0 | RN 项目跑通、NativeWind 颜色正确渲染、Redux store 可读写、底部 Tab 导航骨架可见 | `npm start` 无报错，Tab 切换正常，Redux DevTools 可查 store |
| **CP2：三大页面 UI 完成** | M1 | 首页（Banner + 网格）、书架页（空态 + 列表）、分类页 UI 粉白风格落地，使用 Mock 数据 | 三页面 UI 截图符合设计规范，粉白色调正确，Mock 漫画卡片显示正常 |
| **CP3：阅读链路通畅** | M2 | 漫画详情页、话列表、阅读器 FlatList 可运行，本地图片正确加载，条漫可滚动阅读 | 从首页 → 详情 → 阅读器全链路可跳转，阅读器 100 张图片滚动 ≥ 60fps |
| **CP4：持久化完成** | M3 | 书架收藏/取消、阅读进度自动保存（onViewableItemsChanged）、追漫历史记录，App 重启后数据恢复 | 收藏漫画 → 杀进程重启 → 书架仍存在；阅读进度恢复到上次位置 |
| **CP5：全链路验收** | M4 | 全功能走查、动效补全、SafeArea 适配、性能调优确认、P1 功能（进度显示、历史记录）完成 | 验收清单全部通过，真机 Demo 可演示 |

---

## 5. 风险点与应对方案

### 5.1 NativeWind v4 与 RN 0.74 兼容性风险

| 维度 | 描述 |
|------|------|
| **风险等级** | 🟡 中 |
| **风险描述** | NativeWind v4 依赖 Tailwind CSS v3 编译链，在 RN 0.74 新架构（Fabric/JSI）下部分动态样式（如 `animate-*`）可能无法正常工作；`metro.config.js` 配置错误会导致样式全部失效 |
| **应对方案** | ① 严格锁定版本：`nativewind@^4.0.36`、`tailwindcss@^3.4.0`；② 项目初始化阶段优先验证 NativeWind 环境（CP1 验收项）；③ 参考 NativeWind 官方 [React Native CLI 安装文档](https://www.nativewind.dev/getting-started/react-native-cli)；④ 避免使用动画类（`transition-*`、`animate-*`），动效使用 `react-native-reanimated` 替代 |
| **影响范围** | 若失效，全部 UI 样式需重写为 StyleSheet，影响大；但初期发现成本低 |

### 5.2 Redux Persist + AsyncStorage 在 RN 新架构下的兼容性风险

| 维度 | 描述 |
|------|------|
| **风险等级** | 🟡 中 |
| **风险描述** | `redux-persist` 依赖 `@react-native-async-storage/async-storage`，该库在 RN 0.73+ 新架构下存在初始化时序问题，可能导致 `PersistGate` 长时间停留在 loading 状态 |
| **应对方案** | ① 使用 `@react-native-async-storage/async-storage@^1.23.0`（新架构兼容版本）；② `PersistGate` 设置合理超时（5s），超时后仍渲染 App 保证用户体验；③ 在 `android/app/src/main/jni/MainApplicationTurboModuleManagerDelegate.cpp`（Expo 托管则无需操心）中确认 AsyncStorage 已注册；④ 对于 Expo Managed 项目，使用 `expo-sqlite` 或 MMKV 替代方案作为备选 |
| **备选方案** | 若 AsyncStorage 兼容性问题持续，替换为 `react-native-mmkv`（同步 API，性能更佳，新架构兼容好）|

### 5.3 FlatList 大量图片时的内存管理风险

| 维度 | 描述 |
|------|------|
| **风险等级** | 🟠 高（低端 Android 设备） |
| **风险描述** | 条漫单章 15 张图片 × 720px 宽 WebP，内存占用约 30-50MB，多章节翻页后内存可能超过 200MB，低端 Android 设备（2GB RAM）触发 OOM（OutOfMemory）崩溃 |
| **应对方案** | ① `windowSize={5}`：仅保留前后各 2 屏图片在内存中（核心参数）；② `removeClippedSubviews={true}`：Android 必须开启，裁剪视图之外的 View；③ `expo-image` 自带 LRU 内存缓存，设置 `memoryCachePolicy="discardAnyTime"` 允许低内存时主动释放；④ WebP 格式压缩（封面 < 50KB，条漫页 < 100KB），限制 mock 图片总量 < 20MB；⑤ 章节切换时调用 `Image.clearMemoryCache()`（expo-image API）|
| **验收标准** | iPhone 15 / Pixel 6 上连续滚动 100 张图片，内存占用 < 150MB，帧率 ≥ 55fps |

### 5.4 本地 Assets 路径管理的可维护性风险

| 维度 | 描述 |
|------|------|
| **风险等级** | 🟡 中 |
| **风险描述** | React Native 的 `require()` 是编译时静态分析，不支持动态字符串路径（如 `require(\`../../assets/${id}.webp\``）），若路径管理混乱，会出现图片找不到或 Metro bundler 报错 |
| **应对方案** | ① 所有 `require()` 调用集中在 `assetMap.ts` 中，其他文件通过 key 查表取图片源；② `assetMap.ts` 同时存储图片原始 `width/height`（供 `getItemLayout` 使用）；③ 制作 Mock 数据时，使用脚本批量生成 `assetMap.ts` 模板，减少手动维护；④ 图片命名规范：小写+连字符，例如 `manga-001-cover.webp`、`manga-001-ch-01-page-001.webp` |

### 5.5 TypeScript 严格模式开销风险（补充）

| 维度 | 描述 |
|------|------|
| **风险等级** | 🟢 低 |
| **风险描述** | `strict: true` 开启后，Redux selector 和 Navigation 参数类型推断复杂，初期开发摩擦较高 |
| **应对方案** | 提前定义 `useAppSelector`/`useAppDispatch` typed hooks（`store/hooks.ts`），统一导出；Navigation 参数类型在 `navigation/types.ts` 集中定义，各 Screen 通过 `NativeStackScreenProps<ParamList, 'ScreenName'>` 获取类型安全的 props |

---

## 6. 测试方案

### 6.1 单元测试范围

**测试框架**：Jest + `@testing-library/react-native`

#### Redux Slice 单测

| 测试文件 | 测试场景 |
|---------|---------|
| `bookshelfSlice.test.ts` | ① `addToBookshelf` 新增一项，state 长度 +1；② 重复 add 同一 mangaId 不产生重复；③ `removeFromBookshelf` 删除已有项；④ 删除不存在项 state 不变；⑤ `updateLatestChapter` 更新已有项的 latestChapterId |
| `readingProgressSlice.test.ts` | ① `updateProgress` 写入新进度，progressMap 中存在对应 key；② 重复 update 同一 mangaId 覆盖旧值；③ `clearProgress` 删除对应 key；④ `updatedAt` 时间戳在 update 后大于之前的值 |
| `historySlice.test.ts` | ① `addHistory` 写入记录；② 同一 mangaId 重复访问更新时间戳（不新增重复记录）；③ 超过 50 条时删除最旧记录；④ `clearHistory` 清空所有记录 |

#### 自定义 Hook 单测

| 测试文件 | 测试场景 |
|---------|---------|
| `useBookshelf.test.ts` | ① `isInBookshelf` 初始返回 false；② `addToShelf` 后 `isInBookshelf` 返回 true；③ `removeFromShelf` 后 `isInBookshelf` 返回 false |
| `useReadingProgress.test.ts` | ① `progress` 初始为 undefined；② `saveProgress` 后 `progress.pageIndex` 等于传入值；③ `saveProgress` 多次调用后取最新值 |

### 6.2 集成测试范围

| 测试场景 | 验证内容 | 工具 |
|---------|---------|------|
| **导航流程测试** | 首页 → 点击漫画卡片 → 详情页；详情页 → 点击话数 → 阅读器；阅读器 → 返回 → 详情页 Tab 按预期 | `@testing-library/react-native` + Navigation Mock |
| **书架流程测试** | 详情页点击「加入书架」→ 切换到书架 Tab → 书架列表中出现该漫画 | 同上 |
| **阅读进度恢复测试** | 阅读到第 8 页 → 退出 → 重新打开阅读器 → 自动滚动到第 8 页 | Jest fake timers + Redux store mock |
| **持久化 E2E 测试（手动）** | App 杀进程重启，书架数据和阅读进度不丢失 | 真机手动验证 |

### 6.3 手动验收标准

> 对应 CP5 全链路验收

| # | 验收项 | 通过标准 |
|---|--------|---------|
| 1 | 首页 UI 视觉 | 粉白色调正确，Banner 可轮播，漫画卡片网格对齐，无溢出/截断 |
| 2 | 书架页 UI 视觉 | 空书架显示空状态提示；有漫画时列表正确渲染，进度百分比显示正确 |
| 3 | 分类页 UI 视觉 | 分类标签可点击切换，漫画列表按分类筛选 |
| 4 | 阅读器流畅度 | 真机滚动 100 张图片，无明显掉帧（主观感受流畅），页码指示正确更新 |
| 5 | 书架持久化 | 收藏漫画后杀进程重启，书架数据恢复 |
| 6 | 进度持久化 | 阅读到中间位置杀进程重启，重新进入阅读器从上次位置继续 |
| 7 | SafeArea 适配 | iPhone 刘海屏 / 灵动岛机型，Tab Bar 不被底部手势条遮挡；顶部内容不被刘海遮挡 |
| 8 | Android 兼容性 | Android 真机（或模拟器）Tab 切换、阅读器滚动功能正常 |
| 9 | 导航返回键 | Android 硬件返回键行为符合预期（阅读器返回详情页，不退出 App） |
| 10 | 追漫历史 | 打开漫画详情页后，历史记录中出现该漫画，按时间倒序排列 |

---

## 附录：依赖包清单

```json
{
  "dependencies": {
    "react-native": "0.74.x",
    "@react-navigation/native": "^6.1.x",
    "@react-navigation/bottom-tabs": "^6.5.x",
    "@react-navigation/native-stack": "^6.9.x",
    "react-native-screens": "^3.31.x",
    "react-native-safe-area-context": "^4.10.x",
    "@reduxjs/toolkit": "^2.2.x",
    "react-redux": "^9.1.x",
    "redux-persist": "^6.0.x",
    "@react-native-async-storage/async-storage": "^1.23.x",
    "nativewind": "^4.0.x",
    "expo-image": "^1.12.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.x",
    "typescript": "^5.4.x",
    "@types/react": "^18.x",
    "@testing-library/react-native": "^12.x",
    "jest": "^29.x",
    "@babel/core": "^7.x"
  }
}
```

---

## 交叉复核记录（v1.0 → v1.1）

| # | 问题类型 | 原始内容 | 修正内容 |
|---|---------|---------|--------|
| 1 | 文件遗漏 | 导航层 6 个文件，缺少 `ProfileStack.tsx` | 补充 `ProfileStack.tsx`，导航层改为 7 个文件 |
| 2 | 文件遗漏 | `store/selectors` 仅有 bookshelf 和 readingProgress 两个 | 补充 `historySelectors.ts`，与 historySlice 对称 |
| 3 | 文件遗漏 | `hooks` 层无 `useHistory.ts`，historySlice 缺乏 Hook 封装入口 | 补充 `useHistory.ts`，与 useBookshelf/useReadingProgress 对称 |
| 4 | 类型文件冗余 | `src/types/navigation.ts` 与 `navigation/types.ts` 职责重叠 | 改为 `src/types/chapter.ts`，分离 Chapter 类型定义 |
| 5 | 技术错误 | `borderRadius: { card: '12px' }` RN 不支持字符串像素值 | 改为数字字符串 `'12'`，NativeWind 正确处理转换 |
| 6 | 参数说明错误 | `UPDATE_CELLS_BATCH = 10` 注释：「onEndReached 提前量（items）」 | 修正为正确含义：「批量渲染时间间隔（ms）」，值改为默认值 50 |
| 7 | 渲染策略错误 | `contentFit="cover"` 会裁切条漫图片 | 改为 `contentFit="fill"`，保留条漫完整内容 |
| 8 | 文件总计错误 | 初稿写 54 个文件，实际经修正后为 57 个 | 更新总计为 57 个文件 |

---

*文档由 CatPaw AI 自动生成，经交叉复核（8 处修正）后定稿（v1.1）。*

---

## 实际执行差异记录（2026-06-03）

### 技术方案变更

| 评审方案 | 实际执行 | 原因 |
|---------|---------|------|
| NativeWind v4 (`^4.0.36`) | NativeWind v2 (`^2.0.11`) | v4 内置 react-native-worklets-core 需要 C++ NDK 编译，与 Expo SDK 51 Managed Workflow 不兼容 |
| `babel.config.js` 含 `nativewind/babel` preset | 仅保留 `babel-preset-expo` | v4 的 Babel 插件链会触发 react-native-worklets/plugin 找不到的错误 |
| `metro.config.js` 使用 `withNativeWind` wrapper | 移除 `withNativeWind`，使用默认 `getDefaultConfig` | v2 不需要 Metro CSS 处理管道 |
| `tailwind.config.js` 含 `presets: [require('nativewind/preset')]` | 不含 preset 字段 | 该 preset 仅 v4 需要 |
| `global.css` 作为 NativeWind CSS 入口 | 无 `global.css` 文件 | v2 不使用 CSS runtime，不需要全局 CSS 入口 |
| `expo start --android` | `expo run:android` | 前者依赖 Expo Go，模拟器无 Expo Go 时会卡住；`package.json` 的 `android` 脚本已更新为 `expo run:android` |

### 新增文件（评审未列出）

| 文件路径 | 说明 |
|---------|------|
| `src/screens/reader/components/ReaderHeader.tsx` | 从 `ReaderScreen.tsx` 拆分，控制文件行数 ≤200 行 |
| `src/screens/detail/components/MangaInfoSection.tsx` | 从 `MangaDetailScreen.tsx` 拆分，控制文件行数 ≤200 行 |

### 风险实际处置

| 风险项 | 评审等级 | 实际情况 | 处置方式 |
|-------|---------|---------|---------|
| NativeWind v4 兼容性（§5.1） | 🟡 中风险 | **已触发**：v4 构建失败 | 降级到 v2，项目样式全部使用 `StyleSheet.create`，className 已最小化 |
| FlatList 大量图片内存管理（§5.3） | 🟠 高风险（低端 Android） | 已验证可控 | `windowSize={5}` + `removeClippedSubviews` + expo-image 内存缓存三层防护 |
| FlatList 动态高度 getItemLayout | 🟠 高（评审未单独列出） | **新发现** | 通过 `useMemo` 预计算 `pageOffsets` 数组 + `getItemLayout` 查表解决，支持 `initialScrollIndex` 精准跳转 |
| onViewableItemsChanged 引用稳定性 | 🟡 新发现（评审未覆盖） | **已触发**：直接绑定 useCallback 引发警告 | 通过 `useRef` 包裹回调 + `useEffect` 同步最新依赖解决 |
| Redux Persist + AsyncStorage 时序（§5.2） | 🟡 中风险 | 已验证 | `App.tsx` 使用 `PersistGate` 包裹，等待 rehydrate 完成后再渲染业务组件 |

### 实际文件数统计

- 评审预估：57 个文件
- 实际产出：**49 个 `.ts`/`.tsx` 源文件**（不含测试文件，测试文件留待后续补充）
- 差异说明：测试文件（3 个）未在本次开发阶段生成；工程配置文件（`App.tsx`、`tailwind.config.js` 等）不计入 `src/` 统计

---

*差异记录由 CatPaw AI 在 Phase 4 知识库同步阶段自动生成。*
