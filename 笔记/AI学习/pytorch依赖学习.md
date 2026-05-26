## 张量创建
```python
t1 = torch.tensor([[1,2,3], [2,3,4]]) # 指定值
t2 = torch.randn(2,2) # 标准正态分布
t3 = torch.rand(2,2)  # [0,1)均匀分布随机
t4 = torch.randint(0, 10, (5,2)) # 大于0计算
t5 = torch.zeros(3,4)
t6 = torch.ones(4,5)
t7 = torch.arange(5)
t8 = torch.ones_like(t2)
print(f"tensor直接指定值:\n{t1}")
print(f"randn动态分布:\n{t2}")
print(f"rand[0,1)均匀随机分布\n{t3}")
print(f"randint整数随机\n{t4}")
print(f"zeros全0\n{t5}")
print(f"ones全1\n{t6}")
print(f"arange连续\n{t7}")
print(f"ones_like复制形状\n{t8}")

tensor直接指定值:
tensor([[1, 2, 3],
        [2, 3, 4]])
randn动态分布:
tensor([[ 0.0969,  0.2229],
        [ 0.3428, -0.4891]])
rand[0,1)均匀随机分布
tensor([[0.1945, 0.7705],
        [0.1958, 0.4352]])
randint整数随机
tensor([[7, 9],
        [0, 4],
        [8, 3],
        [6, 6],
        [0, 1]])
zeros全0
tensor([[0., 0., 0., 0.],
        [0., 0., 0., 0.],
        [0., 0., 0., 0.]])
ones全1
tensor([[1., 1., 1., 1., 1.],
        [1., 1., 1., 1., 1.],
        [1., 1., 1., 1., 1.],
        [1., 1., 1., 1., 1.]])
arange连续
tensor([0, 1, 2, 3, 4])
ones_like复制形状
tensor([[1., 1.],
        [1., 1.]])
```

## 张量形状操作

### 查看形状
```python
x = torch.randn(64, 256, 384)
print(x.shape)       # torch.Size([64, 256, 384])
print(x.size())      # 同上
print(x.ndim)        # 3 (维度数)
print(x.numel())     # 64*256*384 = 6291456 (总元素个数)
```

### view — 重塑（不改变数据）
```python
x = torch.randn(64, 256, 65)    # (B, T, C)
y = x.view(64*256, 65)          # (16384, 65)
z = x.view(-1, 65)              # -1 自动算 → (16384, 65)
w = z.view(64, 256, 65)         # 元素总数不变就能还原回去
```

### transpose — 交换两个维度
```python
x = torch.randn(64, 8, 64)       # (B, T, hs)
y = x.transpose(-2, -1)          # 交换最后两维 → (64, 64, 8)
z = x.transpose(1, 2)            # 等价写法
```

### permute — 任意重排维度
```python
x = torch.randn(2, 3, 5)         # (batch, seq, feat)
y = x.permute(0, 2, 1)           # (batch, feat, seq)
```

### squeeze / unsqueeze — 删增维度
```python
x = torch.randn(1, 64, 1, 384)
y = x.squeeze()                  # 删所有长度为1的维度 → (64, 384)
z = x.squeeze(0)                 # 只删第0维 → (64, 1, 384)
w = y.unsqueeze(1)               # 在第1维插入 → (64, 1, 384)，将y没有长度为1的维度插上啦
```

### cat — 沿已有维度拼接，除要拼接的维度，其他维度必须要一样，不能处理一维向量
```python
a = torch.randn(64, 8, 64)
b = torch.randn(64, 8, 64)
c = torch.cat([a, b], dim=-1)    # 最后一维拼 → (64, 8, 128)
d = torch.cat([a, b], dim=0)     # 第0维拼 → (128, 8, 64)
```

### stack — 新建维度堆叠
```python
a = torch.randn(256)
b = torch.randn(256)
c = torch.stack([a, b])          # → (2, 256)
d = torch.stack([a, b], dim=1)   # → (256, 2)
```

## 张量运算

### 逐元素运算（形状必须相同）
```python
a = torch.tensor([1, 2, 3])
b = torch.tensor([4, 5, 6])
print(a + b)   # tensor([5, 7, 9])
print(a * b)   # tensor([4, 10, 18])  逐元素乘，不是矩阵乘
print(a - b)   # tensor([-3, -3, -3])
print(a / b)   # tensor([0.25, 0.40, 0.50])
```

### @ 矩阵乘法
```python
A = torch.randn(3, 4)   # 3行4列
B = torch.randn(4, 2)   # 4行2列
C = A @ B               # → (3, 2)
# 规则：A最后一维(4) 必须等于 B的倒数第二维(4)
# 结果形状：A的前面所有维 + B的最后一维

# 批量矩阵乘法（前B-1维是batch，只在最后两维做）
q = torch.randn(64, 8, 64)      # (B, T, hs)
k = torch.randn(64, 8, 64)      # (B, T, hs)
wei = q @ k.transpose(-2, -1)   # (B, T, hs) @ (B, hs, T) → (B, T, T)
```

### 广播机制 — 形状不同时自动扩展
```python
a = torch.randn(64, 256, 384)   # (B, T, C)
b = torch.randn(384)            # (C,) 一维向量
c = a + b  # → (64, 256, 384)
# 广播规则：从右往左对齐，缺失维度复制扩展
# a: (64, 256, 384)
# b:         (384)   ← 右边对齐，自动扩展到 (1,1,384) 再复制成 (64,256,384)

# 更复杂的例子：
x = torch.randn(3, 1, 5)       # (3, 1, 5)
y = torch.randn(1, 4, 1)       # (1, 4, 1)
z = x + y                      # → (3, 4, 5)  维度为1的会被复制扩展
```

## nn.Linear 内部机制

### Q：nn.Linear 到底在算什么？为什么我看不到运算过程？

```python
linear = nn.Linear(3, 2)  # 输入3维 → 输出2维
```

定义时内部创建了两个东西：
- 权重矩阵 `W.shape = (2, 3)`  ← 注意是 (out_features, in_features)
- 偏置向量 `b.shape = (2,)`

前向时做的运算 = `y = x @ W.T + b`

展开每个神经元：
```
y[0] = x[0]*W[0,0] + x[1]*W[0,1] + x[2]*W[0,2] + b[0]
y[1] = x[0]*W[1,0] + x[1]*W[1,1] + x[2]*W[1,2] + b[1]
```

**每个输出 = 所有输入的加权和 + 偏置。** `linear(x)` 只是 PyTorch 帮你封装好了，背后就是矩阵乘法。

### Q：训练过程中线性层也会被训练吗？

会。`optimizer = torch.optim.AdamW(model.parameters())` 拿到了模型中**所有** nn.Linear 的 weight 和 bias。训练循环中每步：

```
前向: logits, loss = model(xb, yb)      ← 用当前权重算预测
反向: loss.backward()                    ← 自动给所有参数算梯度
更新: optimizer.step()                   ← 梯度反方向调参数
清零: optimizer.zero_grad()              ← 清掉本轮梯度
```

几千步后，随机初始化的权重被逐步调成能让 loss 最小的值——这就是"学习"。

### Q：梯度是什么？

梯度 = 每个参数对 loss 的"敏感度 / 导数"。它告诉优化器：
- 如果调大这个参数，loss 会变大还是变小
- 变化幅度有多大

优化器沿着梯度**反方向**调整参数：`新参数 = 旧参数 - 学习率 × 梯度`

### Q：为什么梯度要清零？为什么不调完参数自动清零？

因为有些场景需要梯度累加（例如显存不够时）：

```python
# 显存只能放16个，但想用64的batch效果
for _ in range(4):
    xb, yb = get_batch('train', batch_size=16)
    logits, loss = model(xb, yb)
    loss.backward()          # 梯度累加到 .grad 上，不清零

optimizer.step()             # 用累加了4次的梯度（等价64个样本）
optimizer.zero_grad()        # 然后手动清零
```

PyTorch 把选择权留给用户，不做自动清零。

不清零的后果：`.grad` 会一直累加，`step()` 以为用的一步的梯度，实际用了多步叠加，参数乱跳。

### Q：loss.backward() 的反向传播是自动针对网络中所有函数吗？被隐藏了吗？

**是的，全部自动，完全被隐藏。**

前向传播时 PyTorch 自动建了一张"计算图"，记录了所有运算步骤：

```
Embedding → Linear(key/query/value) → ... → Linear(lm_head) → cross_entropy → loss
```

`loss.backward()` 从 loss 出发，沿着这张图从后往前，给**每个参与计算的参数**算好 `.grad`。

你只需要写 forward，PyTorch 自动记住怎么 backward。这就是 **自动微分（Autograd）**——PyTorch 的核心魔法。

### 完整训练循环

```python
for iter in range(max_iters):
    xb, yb = get_batch('train')          # 1. 拿数据
    logits, loss = model(xb, yb)         # 2. 前向传播（算预测值）
    optimizer.zero_grad(set_to_none=True) # 3. 清空上轮梯度
    loss.backward()                      # 4. 反向传播（自动算梯度）
    optimizer.step()                     # 5. 更新参数（梯度反方向调一点）
```

## 其他
### nn.Dropout
1. 训练时：正则化技术，每次forward随机扔掉20%的神经元
2. 推理时，全部保留不丢弃
3. 随机丢弃一些，防止网络学会依赖少数几个神经元协作记住训练数据，每次丢弃一些，模型不得不在不同子集上都能工作，迫使每个位置学到更鲁棒的模式。
```python
训练时:
输入 → [0.5, 0.8, 0.3, 0.6, 0.2, 0.9]
              ↓ Dropout(0.2)
       [0.5, 0.0, 0.3, 0.6, 0.0, 0.9]   ← 20% 变 0，剩下的放大 1.25倍

```