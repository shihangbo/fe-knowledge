
const {Readable} = require('stream')

// 根据node提供的Readable类，实现一个自己的可读流类
class MyReadStream extends Readable {
  constructor() {

  }
  _read() {

  }
}

let myStream = new MyReadStream()
myStream.on('data',function(data){

})
myStream.on('end',function(){
  
})