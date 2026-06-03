import type { Manga } from '../types/manga';

export const mockMangas: Manga[] = [
  {
    id: 'manga-001',
    title: '星空下的约定',
    author: '樱花画师',
    description: '平凡少女小澄在一次偶然的机会下，邂逅了转学来的神秘男孩。他们之间会发生怎样浪漫的故事呢？',
    tags: ['恋爱', '日常', '治愈'],
    status: 'ongoing',
    latestChapter: '第2话',
    totalChapters: 2,
    coverId: 'manga-001',
    rating: 4.8,
  },
  {
    id: 'manga-002',
    title: '魔法少女物语',
    author: '月华姬',
    description: '普通女中学生小莉意外获得了魔法力量，开始了与黑暗势力的战斗，同时也要维持普通高中生的日常生活！',
    tags: ['魔法', '热血', '冒险'],
    status: 'ongoing',
    latestChapter: '第2话',
    totalChapters: 2,
    coverId: 'manga-002',
    rating: 4.6,
  },
  {
    id: 'manga-003',
    title: '放学后的咖啡馆',
    author: '甜甜圈社',
    description: '四个性格迥异的女孩在学校的社团活动中，一起经营着一家秘密咖啡馆，温馨而治愈的日常故事。',
    tags: ['日常', '治愈', '友情'],
    status: 'completed',
    latestChapter: '第2话',
    totalChapters: 2,
    coverId: 'manga-003',
    rating: 4.9,
  },
  {
    id: 'manga-004',
    title: '初恋季节',
    author: '粉笔先生',
    description: '青涩的高中岁月里，那段懵懂而美好的初恋故事……',
    tags: ['恋爱', '青春', '治愈'],
    status: 'ongoing',
    latestChapter: '第1话',
    totalChapters: 1,
    coverId: 'manga-004',
    rating: 4.5,
  },
  {
    id: 'manga-005',
    title: '王牌侦探',
    author: '迷雾工作室',
    description: '天才少女侦探樱宫柚香，凭借超强的观察力和推理能力，一次次破解看似不可能的案件。',
    tags: ['悬疑', '推理', '热血'],
    status: 'ongoing',
    latestChapter: '第1话',
    totalChapters: 1,
    coverId: 'manga-005',
    rating: 4.7,
  },
];

// 首页推荐（banner 用）
export const bannerMangas = mockMangas.slice(0, 3);

// 按标签分类
export const MANGA_TAGS = ['全部', '恋爱', '热血', '日常', '治愈', '魔法', '悬疑', '冒险', '青春', '友情'];
