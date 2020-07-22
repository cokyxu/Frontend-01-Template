const foo = require("./foo")

function create(Cls, attributes, ...children) {
    let o = new Cls({
        timer: {}
    });

    for (let key in attributes) {
        // o[key] = attributes[key];
        o.setAttribute(key, attributes[key]);
    }

    for(let child of children) {
        o.children.push(child);
    }
    return o;
}

class Parent {
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

    mountTo(parent) {
        parent.appendChild(this.root);

        for(let child of this.children) {
            child.mountTo(this.root)
        }
    }
}

class Child { 
    constructor(config) {
        this.children = [];
        this.root = document.createElement("span");
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
        
        for(let child of this.children) {
            child.mountTo(this.root)
        }
    }
}  

let component = <Parent id="a" class="b" style="width: 100px; height: 100px; background-color:lightgreen">
    <Child id="child"></Child>
    <Child></Child>
    <Child></Child>
</Parent>

component.class = "c"

component.mountTo(document.body)

// component.setAttribute("id", "a")
console.log(component)
