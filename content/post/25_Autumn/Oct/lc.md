---

---

## LRU & LFU

LRU（最近最少使用）和 LFU（最不经常使用）是两种常用的缓存淘汰算法，它们通过不同的策略在缓存空间不足时决定哪些数据应该被移除。为了让你快速把握全貌，下面这个表格直观地对比了它们的核心特征。

| 特性维度     | **LRU (最近最少使用)**                                       | **LFU (最不经常使用)**                                       |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **核心思想** | 基于**访问时间**，认为最近被访问的数据，未来被访问的概率更高。 | 基于**访问频率**，认为过去被访问次数多的数据，未来被访问的概率更高。 |
| **淘汰策略** | 淘汰最久未被访问的数据。                                     | 淘汰访问频率最低的数据；频率相同时，通常再按时间淘汰最旧的数据。 |
| **数据结构** | 哈希表 + **双向链表**                                        | 哈希表 + **频率哈希表**（通常值也是链表或有序字典）          |
| **优点**     | 对突发性的、周期性的访问模式响应及时，实现相对简单。         | 能更好地保护真正的热点数据，避免周期性扫描干扰。             |
| **缺点**     | 容易受到**批量扫描**操作的影响，可能导致热点数据被淘汰。     | 需要维护更复杂的数据结构，可能存在“历史访问频率”的积累影响，对新的热点数据不敏感。 |
| **适用场景** | 访问模式**随时间变化**明显的场景，如新闻网站、社交媒体的信息流。 | 访问模式相对**稳定**，有明确长效热点的场景，如商品信息缓存、热门视频缓存。 |

------

### 🔨 实现思路与关键代码

#### LRU 实现

LRU 最经典高效的实现是使用一个哈希表（`HashMap`）和一个双向链表（`Doubly Linked List`）。

- **哈希表**：用于快速通过键（`key`）定位到链表中的具体节点，保证 `get`操作的时间复杂度为 O(1)。
- **双向链表**：用于维护数据的访问顺序。**靠近头部的节点是最近访问的，靠近尾部的节点是最久未访问的。**

**关键操作逻辑：**

1. **访问数据 (`get`)**：若数据存在，则通过哈希表定位节点，并将该节点**移动到链表头部**，然后返回数据。
2. **插入数据 (`put`)**：
   - 若数据已存在，更新值，并将节点移动到链表头部。
   - 若数据不存在，检查缓存是否已满。
     - 若已满，则**删除链表尾部的节点**（并同步删除哈希表中的对应项）。
     - 创建新节点，并将其**插入到链表头部**，同时将键值对存入哈希表。

以下是使用 Java 中内置的 `LinkedHashMap`实现 LRU 的一种简洁方式：

```
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        // 设置访问顺序为 true，即按访问顺序排序，最近访问的在后
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // 当缓存大小超过容量时，移除最老的条目（即最近最少使用的）
        return size() > capacity;
    }

    public static void main(String[] args) {
        LRUCache<Integer, String> cache = new LRUCache<>(2);
        cache.put(1, "A");
        cache.put(2, "B");
        cache.get(1); // 访问 key=1，使其成为“最近使用的”
        cache.put(3, "C"); // 加入新数据，此时容量已满，最久未使用的 key=2 会被淘汰
        System.out.println(cache); // 输出: {1=A, 3=C}
    }
}
```

*引自 的实现思路*

#### LFU 实现

LFU 的实现比 LRU 复杂，需要维护**访问频率**信息。一个常见的高效实现需要三个数据结构：

1. **键到值的哈希表 (`keyToVal`)**：快速通过 key 找到 value。
2. **键到频率的哈希表 (`keyToFreq`)**：快速通过 key 找到其当前的访问次数。
3. **频率到键列表的哈希表 (`freqToKeys`)**：将相同访问频率的 key 组织在一起（通常使用 `LinkedHashSet`或有序链表，以维护同一频率下的插入顺序或访问顺序）。

**关键操作逻辑：**

1. **访问数据 (`get`)**：若数据存在，通过 `keyToFreq`找到其旧频率 `freq`，然后在 `freqToKeys`中将 key 从 `freq`对应的列表中移除，并加入到 `freq+1`对应的列表中（若列表不存在则创建）。更新 `keyToFreq`。同时，如果 `freq`对应的列表移除 key 后为空，且 `freq`正好是当前最小频率 `minFreq`，则更新 `minFreq = freq + 1`。
2. **插入数据 (`put`)**：
   - 若数据已存在，操作同 `get`，并更新 value。
   - 若数据不存在，且缓存已满，则需要进行淘汰。根据 `minFreq`，从 `freqToKeys.get(minFreq)`对应的列表**头部**（即最早加入该频率列表的 key）淘汰一个 key，并同步清理 `keyToVal`和 `keyToFreq`中的记录。然后插入新 key，其频率为 1，并设置 `minFreq = 1`。

以下是 LFU 的一个概念性代码框架（以 Java 为例）：

```
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

public class LFUCache<K, V> {
    private final int capacity;
    private int minFrequency;
    private Map<K, V> keyToVal;
    private Map<K, Integer> keyToFreq;
    private Map<Integer, LinkedHashSet<K>> freqToKeys;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFrequency = 0;
        this.keyToVal = new HashMap<>();
        this.keyToFreq = new HashMap<>();
        this.freqToKeys = new HashMap<>();
    }

    public V get(K key) {
        if (!keyToVal.containsKey(key)) {
            return null;
        }
        increaseFrequency(key); // 增加该key的频率并调整相关数据结构
        return keyToVal.get(key);
    }

    public void put(K key, V value) {
        if (capacity <= 0) return;
        if (keyToVal.containsKey(key)) {
            keyToVal.put(key, value);
            increaseFrequency(key);
            return;
        }
        if (keyToVal.size() >= capacity) {
            removeMinFrequencyKey(); // 移除最小频率的key
        }
        keyToVal.put(key, value);
        keyToFreq.put(key, 1);
        freqToKeys.putIfAbsent(1, new LinkedHashSet<>());
        freqToKeys.get(1).add(key);
        minFrequency = 1; // 新插入的key频率为1，最小频率必然为1
    }

    private void increaseFrequency(K key) {
        int freq = keyToFreq.get(key);
        keyToFreq.put(key, freq + 1);
        freqToKeys.get(freq).remove(key);
        if (freqToKeys.get(freq).isEmpty()) {
            freqToKeys.remove(freq);
            if (freq == minFrequency) {
                minFrequency++;
            }
        }
        freqToKeys.putIfAbsent(freq + 1, new LinkedHashSet<>());
        freqToKeys.get(freq + 1).add(key);
    }

    private void removeMinFrequencyKey() {
        LinkedHashSet<K> keyList = freqToKeys.get(minFrequency);
        K deletedKey = keyList.iterator().next(); // 获取最早加入的key
        keyList.remove(deletedKey);
        if (keyList.isEmpty()) {
            freqToKeys.remove(minFrequency);
        }
        keyToVal.remove(deletedKey);
        keyToFreq.remove(deletedKey);
    }
}
```

*该实现思路综合自 *

------

### 💎 总结与选型建议

选择 LRU 还是 LFU，关键在于你的数据访问模式：

- **选择 LRU**：如果你的数据访问模式呈现出较强的**时间局部性**，即最近访问过的数据很快又会被再次访问，或者你的应用场景对突发流量敏感。LRU 实现更简单，开销相对较小，是很多场景下的默认选择 。
- **选择 LFU**：如果你的应用有**明确且相对稳定的热点数据**，你希望长时间保留这些真正的热门项（例如电商中的爆款商品详情）。LFU 能更好地抵御批量扫描操作对缓存的污染，但需要付出实现复杂度和运行开销更高的代价 。

希望这份详细的对比和实现解析能帮助你更好地理解和应用这两种经典的缓存算法！