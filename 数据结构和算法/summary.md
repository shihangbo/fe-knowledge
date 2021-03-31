
# 数据结构和算法

### 1. 为什么学习算法
  1.1 写好程序提高效率  
  1.2 开拓视野增加知识储备  
  1.3 数据可视化，VR，游戏，AI和现在不知道的Anything...   

### 2. 数量级，输入，输出
  2.0 在写算法之前，对数据的应用场景和数据规模全面了解  
  2.1 数量级: 万级，亿级...  
  2.2 算法是输入到输出的映射  
  2.3 淘宝统计订单的算法应该支持【十亿】级数据，在【毫秒】级时间内完成计算  
  2.4 知乎统计用户肖像的算法应该支持【亿】级数据，在【小时】级时间内完成一次统计  
  2.5 React的VirtualDOM应该支持【万】级数据，在【毫秒】级时间内完成一次计算（显示器60HZ，16.7毫秒刷新一次）  

### 3. 二分查找
  3.1 二分法的效率  
      关键问题：最坏的情况从1000个学生【有序排列】里面找到目标学生，递归需要1000次，二分法(1000/500/250...)需要10次，速度提升近100倍..
  3.2 算法抽象  
```ts
function bsearch(A, x)
A: 有序数组
x: 需要查找的值
返回: x在A中的位置，不存在，返回-1
```
  3.3 算法实现  
      循环不变式: l-查找范围左，r-查找范围右  
```ts
function bsearch(A,x){
  let l=0,r=A.length-1,guess;
  while(l<=r){
    guess=Math.floor((l+r)/2)
    // 循环不变式: l-查找范围左，r-查找范围右
    // guess等于l，r的中间位置
    if (A[guess]===x) {
      return guess
    } else if(A[guess]>x) {
      // 查找范围在左
      r=guess-1
    } else {
      // 查找范围在右
      l=guess+1
    }
    // 循环不变式: l-新查找范围左，r-新查找范围右
  }
  return -1
}
```
  4.3 时间复杂度  O(lgn)  

### 4. 插入排序
  4.1 关键问题：如何在一个有序数组中插入一个新值，或者排序问题  
  4.2 算法抽象  
```ts
function insert(A,x)
A: 已排序数组
x: 需要插入的值
返回: 无
```
  4.3 算法实现  
      insert函数的循环不变式: p只想下一个要比较的元素，p+1指向腾出来的空位  
      插入排序 insertion_sort函数的循环不变式: i指向下一个需要排序的元素  
```ts
function insert(A,i,x) {
  let p = i-1
  while(p>=0 && A[p]>x) {
    // 交换位置
    A[p+1] = A[p]
    p--
  }
  // 插值
  A[p+1] = x
}
function insertion_sort(A) {
  for(let i=0,l=A.length;i<l;i++){
    insert(A, i, A[i])
  }
}
```
  4.3 时间复杂度  O(n^2)  
      主循环执行 N-1 次  
      insert函数的 while循环执行时间不固定，最坏的情况为 T(n) = (N^2)/2 - (N/2), N=10000的情况，结合现在cpu主频在4G左右(10亿)，大概需要1s的样子，还是比较慢的  

### 5. 冒泡排序  
  5.1 关键问题：排序问题  
  5.2 算法抽象
```ts
function bubble_sort(A)
A: 需要排序的数组
返回: 无
```
  5.3 算法实现
      循环不变式：外层循环（从大到小）控制当前已排序的次数，内层循环（从小到大）控制当前外层循环次数的各值比较和转换  
```ts
function swap(A,i,j){
  // 从小往大排序
  const t = A[i]
  A[i] = A[j]
  A[j] = t
}
function bubble_sort(A){
  for(let i=A.length-1;i>=1;i--){
    for(let j=0;j<=i;j++){
      A[j] > A[j+1] && swap(A,j,j+1)
    }
  }
}
```
  5.4 时间复杂度  O(n^2)  
      外循环执行i次，内循环执行N-1次  
      最坏的情况为 T(n) = (N^2)/2 - (N/2)  

### 6. 合并排序  
  5.1 关键问题：如何合并两个【有序】数组  
  5.2 算法抽象
```ts
function merge(A,p,q,r)
A: 数组
p: 左半边开始位置
q: 左半边结束，右半边开始位置
r: 右半边结束位置
(注意:位置指的是数组的下标)
```
  5.3 算法实现
      循环不变式：k-下一个写入位置，i-A1中回写位置，j-A2中回写位置
```ts
function merge(A,p,q,r){
  let A1=A.slice(p,q) // 存放左半边的临时空间 - 有序数组
  let A2=A.slice(q,r) // 存放右半边的临时空间 - 有序数组
  // 追加哨兵
  A1.push(Number.MAX_SAFE_INTEGER)
  A2.push(Number.MAX_SAFE_INTEGER)
  // 循环不变式
  for(let k=p,i=0,j=0;k<r;k++){
    A[k]=A1[i]<A2[j]?A1[i++]:A2[j++]
  }
}
```
  5.4 时间复杂度  O(nlgn)  

### 6. 归并排序（合并算法升级）  
  5.1 关键问题：如何合并两个数组  
  5.2 算法抽象
```ts
1. 将原数组不断拆分，直到长度为1
2. 不断将已排序数据合并，恢复到整个数组
```
  5.3 算法实现
      循环不变式：
```ts
function merge(A,p,q,r){
  let A1=A.slice(p,q) // 存放左半边的临时空间 - 有序数组
  let A2=A.slice(q,r) // 存放右半边的临时空间 - 有序数组
  // 追加哨兵
  A1.push(Number.MAX_SAFE_INTEGER)
  A2.push(Number.MAX_SAFE_INTEGER)
  // 循环不变式
  for(let k=p,i=0,j=0;k<r;k++){
    A[k]=A1[i]<A2[j]?A1[i++]:A2[j++]
  }
}
// A: 待排序数组
// p: 起始位置，0
// r: 结束位置，A.length
function merge_sort(A,p,r){
  if(r-p<2){return}
  const q=Math.ceil((p+r)/2)
  merge_sort(A,p,q)
  merge_sort(A,q,r)
  merge(A,p,q,r)
}
```
  5.4 时间复杂度  
      十万条数据，执行100次，统计平均时间为：29.723ms  

### 7. 递归（未完成）  
  7.1 关键问题：如何合并两个有序数组  
  7.2 算法抽象
```ts
function
```
  7.3 算法实现
```ts
```
  7.4 时间复杂度  O(nlgn)  

### 8. 递归图形绘制 - 一棵树
```ts
/*
ctx: canvas.getContent('2d')
p: 起点位置坐标 [x,y]
a: 树干的方向 和垂直屏幕线的夹角度数
w: 树干的宽度 每次是上一次的0.65倍
h: 树干的长度 每次是上一次的0.9倍
L: 树干的层级 每次层级加1
*/
function tree_plot(ctx,p,a,w,h,L){
  if(L>10){return} // 递归初始条件
  const [x,y]=p
  // 使用canvas绘制一个枝干
  ctx.translate(x,y)
  ctx.rotate(a*Math.PI/180)
  ctx.moveTo(-w/2,0)
  ctx.lineTo(-w*0.65/2,-h)
  ctx.lineTo(w*0.65/2,-h)
  ctx.lineTo(w/2,0)
  ctx.strokeStyle=color(L)
  ctx.setTransform(1,0,0,1,0,0)
  ctx.fill()
  // 计算下一个绘制位置nextp
  const nextX=x+h*Math.sin(a*Math.PI/180)
  const nextY=y-h*Math.cos(a*Math.PI/180)
  tree_plot([nextX,nextY],a+15,w*0.65,h*0.9,L+1)
  tree_plot([nextX,nextY],a-15,w*0.65,h*0.9,L+1)
}
```

### 9. 递归和穷举
  9.1 求集合{a,b,c}的所有子集（穷举）：可以转换为依次决策要不要选择集合中的某个元素的决策问题  
```ts
```
  9.2 求字符串abc的全排列（全排列）：可以转换成依次决策从序列中拿出一个字符的决策问题   
```ts
```

### 10. 组合问题
  10.1 关键问题：  
  10.2 算法抽象
  10.3 算法实现
  10.4 时间复杂度

### 11. 递归的空间优化

### 12. 递归的回溯算法 - 老鼠走出迷宫
  12.1 关键问题：迷宫有一只老鼠，在左上角位置，老鼠想要走出迷宫（出口在左下），灰色区代表墙，白色区可以行走，每次老鼠走一格，写一个算法帮助老鼠走出迷宫  
  12.2 思路
```ts
// 
function backtracking(...){
  if(到达终点){
    返回【路径】
  }
  找到所有没有走过的选择
  递归前往每一个选择
}
```
  12.3 算法抽象
```ts
/*
maze: 迷宫矩阵(二维数组)，0代表路，1代表墙，2代表出口
pos: 当前位置，初始位置
path: 路径
transverse: 到过的地方记录
返回: path
*/
const maze = [
  [0,1,0,0,0,0],
  [0,1,0,1,1,0],
  [0,0,0,1,0,1],
  [1,1,0,0,0,1],
  [0,0,0,1,1,1],
  [2,1,0,0,0,0]
]
function rat_in_maze(maze,pos=[0,0],path=[],transverse=[]){...}
```
  12.4 算法实现
```ts
function rat_in_maze(maze,pos=[0,0],path=[[...pos]],transverse=[]){
  const [x,y]=pos
  if(maze[x][y]===2){
    return path
  }
  mazeLength = maze.length
  // 记录当前走过的位置
  transverse[x*mazeLength+y]=1
  // 找到当前所有没有走过的选择
  const choices=[
    [x+1,y],
    [x-1,y],
    [x,y+1],
    [x,y-1]
  ].filter(([x,y])=>{
    return x>=0 && y>=0 && x<mazeLength && y<maze[0].length
          && maze[x][y] !== 1
          && !transverse[x*mazeLength+y]
  })
  // 递归前往每一个选择
  for(let [x,y] of choices){
    const p=rat_in_maze(maze,[x,y],path.concat([[x,y]]),transverse)
    if(p) return p
  }
}
```
  12.5 时间复杂度

### 13. 递归的重复子问题
  13.1 斐波那契数列的优化: 1,1,2,3,5,8,13,21,...
```ts
// 普通
function fib(n){
  return n<=1?1:(fib(n-1)+fib(n-2))
}
// 动态规划优化
funtion fib_good(n){
  let a=1,b=1
  for(let i=2;i<=n;i++){
    [b,a]=[a+b,b]
  }
  return b
}
```
  13.4 蚂蚱爬楼梯问题: 一只蚂蚱爬n级楼梯，他可以1次爬1级，2级,...n级，求一共有多少种爬法？  
    13.4.1 算法抽象
```ts
1. 爬n级楼梯，可以直接跳n级
2. 爬n级楼梯，可以先递归爬上n-1级，再跳1级
3. 爬n级楼梯，可以先递归爬上n-2级，再跳2级
4. ...
5. 爬n级楼梯，可以先递归爬上1级，再跳n-1级
```
    13.4.1 算法实现
```ts
// 暴力求解
function steps(n){
  if(n===0){
    return 1
  }
  return [...Array(n)].map((_,i)=>i).reduce((s,i)=>{return steps[i]+s},0)
}
// 优化 - 自下而上构造
function steps(n){
  const s=[1,1]
  for(let i=2;i<=n;i++){
    s[i]=s.reduce((a,b)=>a+b)
  }
  return s.pop()
}

```



### 排序算法概述  
  7.0 概述
```ts
O(n^2): 插入排序，比较排序，冒泡排序    ---> 基于比较
O(nlgn): 合并排序，快速排序，分块排序   ---> 基于比较
O(n)/O(nk): 桶排序，基数排序          ---> 其他

