// 虚拟DOM元素的类
class Element {
    // 将这些对象挂载到该对象的私有属性上，这样在new时也会有这些属性
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}
/**
 * 创建元素
 * @param {*} type 元素类型
 * @param {*} props 属性
 * @param {*} children 孩子
 */
function createElement(type, props, children) {
    return new Element(type, props, children);
}

/**
 * 给元素设置属性
 * @param {*} node 给谁设
 * @param {*} key 属性名
 * @param {*} value 属性值
 */
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
 * render方法将虚拟DOM转换成真实DOM
 * @param {*} eleObj 虚拟节点
 */
function render(eleObj) {
    let el = document.createElement(eleObj.type); // 创建元素
    for(let key in eleObj.props) {
        // 设置属性的方法
        setAttr(el, key, eleObj.props[key])
    }
    eleObj.children.forEach(child => {
        // 判断子元素是否是Element类型，是则递归，不是则创建文本节点
        child = (child instanceof Element) ? render(child) : document.createTextNode(child);
        el.appendChild(child);
    });
    return el;
}

/**
 * 将真实DOM渲染到浏览器上
 * @param {*} el 真实DOM
 * @param {*} target 渲染目标
 */
function renderDom(el, target) {
    target.appendChild(el);
}

export {
    createElement,
    render,
    Element,
    renderDom
}