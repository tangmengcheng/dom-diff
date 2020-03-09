import {createElement, render, renderDom} from './element';
import diff from './diff'
import patch from './patch'
let virtualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['b'])
]);

let virtualDom2 = createElement('ul', {class: 'list-group'}, [
    createElement('li', {class: 'item'}, ['1']),
    createElement('li', {class: 'item'}, ['a']),
    createElement('div', {class: 'item'}, ['3'])
]);


let dom = render(virtualDom);
// 将虚拟DOM转换成了真实DOM渲染到页面上
renderDom(dom, window.root);
// console.log(dom);
let patches = diff(virtualDom, virtualDom2);
// 给元素打补丁，重新更新视图
patch(dom, patches);

// DOM Diff比较两个寻DOM区别  比较两个对象的区别
// DOM Diff的作用：根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来更新DOM

// 如果平级元素有互换 那么会导致重新渲染
// 新增节点也不会被更新
// index