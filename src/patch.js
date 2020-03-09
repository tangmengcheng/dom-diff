import {Element, render} from './element'
let allPatches;
let index = 0; // 默认那个需要打补丁
/**
 * 给元素打补丁，重新更新视图
 * @param {*} node 元素节点
 * @param {*} patches 补丁
 */
function patch(node, patches) {
    console.log(node)
    allPatches = patches;
    // 给某个元素打补丁
    walk(node);
}

function setAttr(node, key, value) {
    switch(key) {
        case 'value': // node是一个input或者textarea
            if(node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                node.value = value;
            } else { // 普通属性
                node.setAttribute(key, value);
            }
        break;
        case 'style':
            node.style.cssText = value;
        break;
        default:
            node.setAttribute(key, value);
        break;
    }
}

/**
 * 给那个节点打那个补丁   后序遍历
 * @param {*} node 那个节点
 * @param {*} patches 那个补丁
 */
function doPatch(node, patches) {
    patches.forEach(patch => {
        switch(patch.type) {
            case 'ATTRS':
                for(let key in patch.attrs) {
                    let value = patch.attrs[key];
                    if(value) {
                        setAttr(node, key, value);
                    } else{
                        node.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                node.textContext = patch.text;
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node);
                break;
            case 'REPLACE':
                let newNode = (patch.newNode instanceof Element) ? render(patch.newNode) : document.createTextNode(patch.newNode);
                node.parentNode.replaceChild(newNode, node);
                break;
            default:
                break;
        }
    })
}

function walk(node) {
    let currentPatch = allPatches[index++];
    let childNodes = node.childNodes;
    childNodes.forEach(child => walk(child));
    if(currentPatch) {
        doPatch(node, currentPatch);
    }
}

export default patch;