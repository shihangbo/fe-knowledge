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
  preorderTraversal() {
    // 深度优先
    function traversal(node) {
      if (node == null) return
      console.log(node.element) // 10 8 6 19 15 22 20
      traversal(node.left)
      traversal(node.right)
    }
    traversal(this.root)
  }
  levelOrderTraversal(cb) {
    // 广度优先
    let stack = [this.root]
    let index = 0
    let currentNode;
    while(currentNode = stack[index++]) {
      cb(currentNode) // 10 8 19 6 15 22 20
      currentNode.left && stack.push(currentNode.left)
      currentNode.right && stack.push(currentNode.right)
    }
  }
  // 二叉树的反转
  reverse() {
    let stack = [this.root]
    let index = 0
    let currentNode;
    while(currentNode = stack[index++]) {
      let temp = currentNode.left
      currentNode.left = currentNode.right
      currentNode.right = temp
      currentNode.left && stack.push(currentNode.left)
      currentNode.right && stack.push(currentNode.right)
    }
  }

}

let tree = new Tree()
![10, 8, 19, 6, 15, 22, 20].forEach(element => {
  tree.add(element)
})
// console.dir(tree, {depth: 1000})

// 遍历树
// - 先序（深度优先），中序（左边优先，有顺序的节点遍历，从左往右），层序（广度优先）
// - 递归 or 非递归（栈优化）
tree.preorderTraversal()  // 深度优先
tree.levelOrderTraversal((node) => { // 广度优先
  // 思想：webpack - ast/babel树的遍历，需要在遍历的过程中将当前节点传递出来使用 -> 回调函数
  console.log(node.element)
})

// 二叉树的反转
tree.reverse()
console.dir(tree, {depth: 1000})






