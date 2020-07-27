import { create } from "./createElement"


class Carousel {
    constructor(config) {
        this.children = [];
        this.root = document.createElement("div");
    }

    set class(v) {
        this.root.className = v;
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
        this[name] = value;
    }

    appendChild(child) {
        this.children.push(child)
    }

    addEventListener(type, hander, confg) {
        this.root.addEventListener(type, hander, confg)
    }

    render() {
        let children = this.data.map(url => {
            let element = <img src={url} />
            element.addEventListener("dragstart", event => event.preventDefault());
            return element;
        });
        let root = <div class="carousel">
            {children}
        </div>

        let position = 0;

        let nextpic = () => {

            let nextPosition = (position + 1) % this.data.length;

            let current = children[position];
            let next = children[nextPosition];

            /////////////////////////////////////////////////////////////////////////////////////
            current.style.transition = "none"; // 与下面的写法等效
            next.style.transition = "ease 0s";
            ///////////////  意思是从其他地方到下面的位置是不需要动画的  ///////////////////////////

            current.style.transform = `translateX(${- 100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            // 用 setTimeout 16ms 是一种比较安全的方式（不使用异步在其他浏览器可能会有问题）
            // 连续的 dom 操作会合并
            setTimeout(() => {
                current.style.transition = ""; // mean use css rule
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - 100 * position}%)`;
                next.style.transform = `translateX(${- 100 * nextPosition}%)`;

                position = nextPosition;
            }, 16);

            setTimeout(nextpic, 3000);
        }
        setTimeout(nextpic, 3000);

        return root
    }

    mountTo(parent) {
        this.render().mountTo(parent);

    }
}



let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}></Carousel>

component.class = "c"

component.mountTo(document.body)

// component.setAttribute("id", "a")
console.log(component)
