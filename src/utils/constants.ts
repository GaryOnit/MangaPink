import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
};

// 阅读器图片尺寸（条漫按屏幕宽度自适应，固定宽高比 9:16）
export const READER_PAGE = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: Math.round(SCREEN_WIDTH * (640 / 360)),
};

// 漫画卡片尺寸（2 列网格）
export const MANGA_CARD = {
  WIDTH: (SCREEN_WIDTH - 48) / 2,
  HEIGHT: Math.round(((SCREEN_WIDTH - 48) / 2) * (4 / 3)),
};

export const HISTORY_MAX_RECORDS = 50;

export const MANGA_TAGS = ['全部', '恋爱', '校园', '古风', '奇幻', '治愈', '搞笑', '悬疑'];
