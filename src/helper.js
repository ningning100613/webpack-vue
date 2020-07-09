import { mul } from './tree-shaking'
import $ from 'jquery'
alert('this is helper')
const add = (x, y) => {
  return x + y
}

console.log(add(2,3))
console.error('this is test')
console.log('tree-shaking:', mul(2, 3))
console.log('分割代码-jquery:', $)
