export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  status: 'ongoing' | 'completed';
  latestChapter: string;
  totalChapters: number;
  coverId: string;
  rating: number;
}
