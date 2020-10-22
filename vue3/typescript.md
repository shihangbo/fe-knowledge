//元组
const tuple:[string,number]=['watson',1]
console.log(tuple)

// 1- 接口：描述对象的形状
//接口 interface
//接口拓展 extends
//类型断言 ({}) as 接口

// 2- 函数：主要关心返回值 和 参数
//function声明的
//箭头函数：
  // type：声明一个类型，仅仅是一个别名，一般在定义联合类型/定义临时变量时，使用
  type Sum1 = ((a:number,b:number) => number) | string
  let sum1:Sum1 = (a:number,b:number):number => a + b
  sum1 = 'watson'
  // interface：声明一个接口，可以继承，可以被类来实现
  interface Sum2 {
    (a:number,b:number): number
  }
  let sum2:Sum2 = (a:number,b:number):number => a + b

// 3- 泛型 T ：用来在代码执行时传入的类型，来确定结果
//单个泛型
function createArray<T>(len:number,value:T):T[]{
  let res=[]
  for(let i=0;i<len;i++){
    res.push(value)
  }
  return res
}
let arr=createArray(3,'watson')
console.log(arr)
//多个泛型 - 元组的交换 [string,number] -> [number,string], [boolean,number] -> [number,boolean]
const swap = <T,K>(tuple:[T,K])=>{
  return [tuple[1],tuple[0]]
}
swap<string,number>(['1',2])
swap<boolean,number>([true,1])
