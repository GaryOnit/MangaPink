/**
 * AsyncStorage 版本迁移工具
 * 当持久化 schema 升级时，在此处添加迁移逻辑
 */

export const PERSIST_VERSION = 1;

/**
 * 迁移函数：从旧版本数据迁移到新版本
 * key 为 slice 名称，state 为当前存储的 state
 */
export function migrate(state: unknown, version: number): unknown {
  // v0 -> v1: 初始版本，无需迁移
  if (version === 0) {
    return state;
  }
  return state;
}
