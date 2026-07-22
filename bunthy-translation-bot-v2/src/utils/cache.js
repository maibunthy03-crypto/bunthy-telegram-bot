class TTLCache {
  constructor(maxItems, ttlSeconds) {
    this.maxItems = maxItems;
    this.ttlMs = ttlSeconds * 1000;
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    this.store.delete(key);
    this.store.set(key, item);
    return item.value;
  }

  set(key, value) {
    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    while (this.store.size > this.maxItems) {
      this.store.delete(this.store.keys().next().value);
    }
  }

  get size() {
    return this.store.size;
  }
}

module.exports = TTLCache;
