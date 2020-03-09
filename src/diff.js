/**
 * diff算法 规则：同层比较
 * 当节点类型相同时，去看一下属性是否相同 产生一个属性的补丁包{type:'ATTRS', attrs: {class: 'list-group'}}
 * 新的dom节点不存在{type: 'REMOVE', index: xxx}
 * 节点类型不相同 直接采用替换模式 {type: 'REPLACE', newNode: newNode}
 * 文本的变化：{type: 'TEXT', text: 1}
 * @param {*} oldTree 旧树
 * @param {*} newTree 新树
 */
function diff(oldTree, newTree) {
    let patches = {};
    let index = 0; // 默认先比较树的第一层
    // 递归树  比较后的节点放到补丁包中
    walk(oldTree, newTree, index, patches);
    return patches;
}

/**
 * 比较属性: 比较两个节点数的属性是否相同，把不同的存放在patch对象中
 * @param {*} oldAttrs 
 * @param {*} newAttrs 
 */
function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    // 判断老的属性中和新的属性的关系
    for(let key in oldAttrs) {
        if(oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]; // 将新属性存放在patch对象中, 有可以是undefined(如果新的属性中没有老的属性中的属性)
        }
    }
    for(let key in newAttrs) {
        // 老的节点中没有新节点中的属性
        if(!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}

/**
* 判断两个节点中的儿子节点
 * @param {*} oldChildren 老的儿子节点
 * @param {*} newChildren 新的儿子节点
 * @param {*} index 
 * @param {*} patches 
 */
function diffChildren(oldChildren, newChildren, patches) {
    oldChildren.forEach((child, idx) => {
        // 索引不应该是index------
        // index 每次传递给walk时  index是递增的, 所有的人都基于同一个人
        walk(child, newChildren[idx], ++Index, patches);
    });
}

/**
 * 判断是否是字符串
 * @param {*} node 
 */
function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]'
}
const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
let Index = 0;
/**
 * 递归树
 * @param {*} oldNode 老节点
 * @param {*} newNode 新节点
 * @param {*} index 比较层数
 * @param {*} patches 存放补丁包
 */
function walk(oldNode, newNode, index, patches) {
    let currentPatch = []; // 每个元素都有一个补丁对象
    if(!newNode) { // 新节点中删除了子节点
        currentPatch.push({type: REMOVE, index: index});
    }else if(isString(oldNode) && isString(newNode)) {
        if(oldNode !== newNode) { // 判断两个文本是否一样
            currentPatch.push({type: TEXT, text: newNode})
        }
    } else if(oldNode.type === newNode.type) { // 两个节点数的元素类型相同, 就比较属性
        // 比较属性是否有更新
        let attrs = diffAttr(oldNode.props, newNode.props);
        // 判断变化的属性结果有没有值
        if(Object.keys(attrs).length > 0) { // 属性有更改
            currentPatch.push({type: ATTRS, attrs})
        }
        // 如果有儿子节点 遍历儿子
        diffChildren(oldNode.children, newNode.children, patches);
    } else { // 说明节点被替换了，都不相同
        currentPatch.push({type: REPLACE, newNode});
    }
    // 当前元素确实有补丁
    if(currentPatch.length > 0) {
        // 将元素和补丁对应起来  放到大补丁包中
        patches[index] = currentPatch;
        console.log(patches)
    }
}

export default diff;