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

export const MANGA_CARD = {
  WIDTH: (SCREEN_WIDTH - 48) / 3,  // 三列网格
  HEIGHT: Math.round(((SCREEN_WIDTH - 48) / 3) * (4 / 3)),
};

export const HISTORY_MAX_RECORDS = 50;
