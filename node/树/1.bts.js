class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.right = null
    this.left = null
  }
}

class Tree {
  constructor() {
    this.root = null
  }
  add(element) {
    // 创建第一个节点
    if (!this.root) {
      return this.root = new Node(element)
    }
    // 加入子节点
    let currentNode = this.root // 更新当前节点
    let parent;
    let compare;
    while(currentNode) {
      parent = currentNode
      compare = currentNode.element < element
      currentNode = compare ? currentNode.right : currentNode.left
    }
    // 如果 currentNode.right 或者 currentNode.left 为null，循环停止
    let node = new Node(element, parent)
    // 大于存在
    compare ? parent.right = node : parent.left = node
  }
}

let tree = new Tree()
![10, 8, 19, 6, 25, 20].forEach(element => {
  tree.add(element)
})
console.dir(tree, {depth: 1000})

// 遍历树，先序，中序，层序
