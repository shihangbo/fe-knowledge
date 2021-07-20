// 链表

// 单向链表
// 单向循环链表
// 双向链表
// 双向循环链表

// 单向链表实现
/**
 * element 存储数据
 * next    存储下一个数据项指针
 */
class Node {
  constructor(element,next) {
    this.element = element
    this.next = next
  }
}
// 存储数据，增上改查 add/remove/set/get
class LinkedList {
  constructor() {
    this.size = 0
  }
  // 根据索引查找节点，并返回
  _node(index) {
    let current = this.head
    for(let i=0; i<index; i++) {
      current = current.next
    }
    return current
  }
  add(element, index) {
    let head = this.head
    let num = index || this.size
    // 创建第一个节点
    if (num === 0) {
      this.head = new Node(element, head)
    } else {
      let prevNode = this._node(num - 1)
      prevNode.next = new Node(element, prevNode.next)
    }
    this.size++
  }
  remove(index) {
    let removeNode;
    // 删除第一个
    if (index === 0) {
      removeNode = this.head
      this.head = this.head.next
    } else {
      removeNode = prevNode.next
      // 找到让上一个节点，指向下一个的下一个节点
      let prevNode = this._node(index - 1)
      prevNode.next = prevNode.next.next
    }
    return removeNode
  }
  set() {}
  get() {}
  reserve() {
    // 链表反转如何实现
    // 1，递归，两两反转
    // 2，循环
    let head = this.head
    if (head == null || head.next == null) return head
    let newHead = null
    while(head) {
      let temp = head.next
      head.next = newHead
      newHead = head
      head = temp
    }
    this.head = newHead
    return newHead
  }
}

let ll = new LinkedList()
ll.add(1)
ll.add(2)
ll.add(3)
ll.add(4)
ll.add(5) // 默认尾部添加
ll.add(100, 2) // 根据索引添加
console.log(ll.remove(0)) // 删除节点
console.dir(ll.reserve(), {depth: 100}) // 反转
console.dir(ll, {depth: 100})




