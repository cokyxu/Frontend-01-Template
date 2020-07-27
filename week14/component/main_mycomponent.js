const foo = require("./foo")

function create(Cls, attributes, ...children) {
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

    for (let child of children) {
        if (typeof child === "string") {
            child = new Text(child);
        }
        o.children.push(child);
    }
    return o;
}

class MyComponent {
    constructor(config) {
        this.children = [];
        this.root = document.createElement("div");
    }

    set class(v) {
        this.root.className = v;
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child)
    }

    render() {
        return <article>
            <header>header</header>
                { this.slot }
            <footer>footer</footer>
        </article>
    }

    mountTo(parent) {
        this.slot = <div></div>
        for (let child of this.children) {
            this.slot.appendChild(child);
            // child.mountTo(this.slot);
        }
        this.render().mountTo(parent);

    }
}

class Text {
    constructor(type) {
        this.root = document.createTextNode(type);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}


// 处理小写的 div (渲染成字符串的div)
class Wrapper {
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

    appendChild(child) {
        this.children.push(child)
    }

    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            child.mountTo(this.root)
        }
    }
}

let component = <MyComponent id="a" class="b" style="width: 100px; height: 100px; background-color:lightgreen">
    <MyComponent id="child"></MyComponent>
    <MyComponent>123</MyComponent>
    <p></p>
    <span id="str"></span>
</MyComponent>

component.class = "c"

component.mountTo(document.body)

// component.setAttribute("id", "a")
console.log(component)
