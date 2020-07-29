export class Timeline
{
    constructor() {
        this.animations = [];
        this.requestID = null;
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime;
            let animations = this.animations.filter(animation => !animation.finished); // 只执行还没结束的 animation
            for(let animation of animations) {
                // 时间超过了延迟和时间间隔，就停下来
                // if(t > animation.duration + animation.delay) {
                //     continue;
                // }
    
                // startTime: 
                let {object, property, template, start, end, duration, delay, startTime, timingFunction} = animation;
                let progression = timingFunction((t - delay - startTime) / duration);  // 0 - 1之间
    
                if(t > duration + delay + startTime) {
                    progression = 1;
                    animation.finished = true;  // 动画结束
                }
    
                let value = animation.valueFromProgression(progression);  // 根据 progression 算出当前的位置
    
                object[property] = template(value);
            }
    
            if(animations.length) {
                this.requestID = requestAnimationFrame(() => this.tick())
            }
        }
    }

    pause() {
        if(this.state !== "playing") {
            return
        }

        this.state = "pause";
        this.pauseTime = Date.now();
        if(this.requestID !== null) {
            cancelAnimationFrame(this.requestID)
        }
    }

    resume() {
        if(this.state !== "pause") {
            return
        }

        this.state = "playing";
        this.startTime += Date.now() - this.pauseTime
        this.tick();
    }

    start() {
        if(this.state !== "inited") {
            return
        }

        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }

    restart() {
        if(this.state === "playing") {
            this.pause();
        }

        // this.animations = [];
        this.requestID = null;
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }

    add(animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state === "playing") {
            animation.startTime = startTime !== void 0 ? startTime: Date.now() - this.startTime ;
        } else {
            animation.startTime = startTime !== void 0 ? startTime : 0;
        }
    }
}

export class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.property = property
        this.template = template
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay
        this.timingFunction = timingFunction || ((start, end) => {
            return (t) => start + (t / duration) * (end - start)
        })
    }

    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}



export class ColorAnimation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.property = property
        this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})` )
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay
        this.timingFunction = timingFunction || ((start, end) => {
            return (t) => start + (t / duration) * (end - start)
        })
    }

    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a)
        }
    }
}


