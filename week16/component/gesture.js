export function enableGesture(element) {

    let contexts = Object.create(null);

    let MOUSE_SYMBOL = Symbol("mouse");

    if (document.ontouchstart !== null) {
        element.addEventListener("mousedown", () => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
            start(event, contexts[MOUSE_SYMBOL]);

            let mousemove = (event) => {
                move(event, contexts[MOUSE_SYMBOL]);
                // console.log(event.clientX, event, event.clientX);
            };
            let mouseend = (event) => {
                end(event, contexts[MOUSE_SYMBOL]);
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseend);
            };

            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", mouseend);
        });
    }


    element.addEventListener("touchstart", event => {
        for (let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    });

    element.addEventListener("touchmove", event => {
        for (let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    });

    element.addEventListener("touchend", event => {
        for (let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });

    // 突然有一个事件，或者手势被识别成了系统手势，会触发 cancel
    element.addEventListener("touchcancel", event => {
        for (let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });

    // 写成鼠标和手势都支持的事件
    let start = (point, context) => {
        let e = new CustomEvent("start");
        Object.assign(e, {
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY
        });
        element.dispatchEvent(e);

        context.startX = point.clientX;
        context.startY = point.clientY;
        context.isTab = true;
        context.isPan = false;
        context.isPress = false;
        context.moves = [];
        context.isTimeHandler = setTimeout(() => {
            if (context.isPan) {
                return;
            }

            context.isTab = false;
            context.isPan = false;
            context.isPress = true;

        }, 500);
    }

    let move = (point, context) => {
        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;

        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) {
                let e = new CustomEvent("presscancel");
                element.dispatchEvent(e);
            }

            context.isTab = false;
            context.isPan = true;
            context.isPress = false;

            let e = new CustomEvent("panstart");
            Object.assign(e, {
                startX: context.clientX,
                startY: context.clientY,
                clientX: point.clientX,
                clientY: point.clientY
            });
            element.dispatchEvent(e);
        }

        if (context.isPan) {
            context.moves.push({
                dx: dx,
                dy: dy,
                t: Date.now()
            })
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);  // 过滤出最近 300ms 的点

            let e = new CustomEvent("pan");
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            });
            element.dispatchEvent(e);
        }
    }


    let end = (point, context) => {
        if (context.isTab) {

            console.log("isTab");
        }

        if (context.isPan) {
            let dx = point.clientX - context.startX;
            let dy = point.clientY - context.startY;
            let record = context.moves[0];
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
            let isflick = speed > 2;
            if (isflick) {
                let e = new CustomEvent("flick");
                Object.assign(e, {
                    startX: context.clientX,
                    startY: context.clientY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed: speed
                });
                element.dispatchEvent(e);
            }
            let e = new CustomEvent("panend");
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed: speed
            });
            element.dispatchEvent(e);
        }

        if (context.isPress) {
        }

        clearTimeout(context.isTimeHandler);
    }

    let cancel = (point, context) => {
        element.dispatchEvent(Object.assign(new CustomEvent('canceled', {})));

        clearTimeout(context.isTimeHandler);
    }
}