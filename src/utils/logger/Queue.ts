const getId = () => `${new Date().getTime()}${Math.random() * 100}`;

export type Level = 'error' | 'warn' | 'info';

export default class Queue {
  cacheInfo = [];
  constructor() {
    this.cacheInfo = [];
  }
  add(level: Level, data, label: string) {
    const id = getId();
    this.cacheInfo.push({
      id,
      level,
      data: data,
      label
    });
    return id;
  }
  update(id: string, level: Level, data, label: string) {
    const list = this.cacheInfo;
    const findIndex = list.findIndex(item => item.id === id);
    if (findIndex < 0) {
      return this.add(level, data, label);
    }
    this.cacheInfo.splice(findIndex, 1, {
      id,
      level,
      data: data,
      label
    });
    return id;
  }
  getAll() {
    const result = this.cacheInfo.map(item => ({
      level: item.level,
      data: item.data,
      label: item.label
    }));
    return JSON.stringify(result);
  }
  removeAll() {
    this.cacheInfo = [];
  }
  has(limitCount: number) {
    if (limitCount) {
      return this.cacheInfo.length >= limitCount;
    }
    return this.cacheInfo.length > 0;
  }
}
