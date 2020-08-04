export function create(Cls, attributes, ...children) {
    let o;
    if (typeof Cls === 'string') {
        o = new Wrapper(Cls)
    } else {
        o = new Cls({
            timer: {}
        });
    }

    for (let key in attributes) {
        // o[key] = attributes[key];
        o.setAttribute(key, attributes[key]);
    }

    let visit = children => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new Text(child);
            }
            if((typeof child === "object") && (child instanceof Array)) {
                visit(child)
                continue;
            }
            o.children.push(child);
        }
    }

    visit(children);

    return o;
}


export class Text {
    constructor(type) {
        this.root = document.createTextNode(type);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

// 处理小写的 div (渲染成字符串的div)
export class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }

    set class(v) {
        this.root.className = v;
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    addEventListener(type, hander, confg) {
        this.root.addEventListener(type, hander, confg)
    }

    appendChild(child) {
        this.children.push(child)
    }

    get style() {
        return this.root.style;
    }

    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            child.mountTo(this.root)
        }
    }
}
