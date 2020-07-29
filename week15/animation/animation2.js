export class Timeline
{
    constructor() {
        this.animations = [];
    }

    tick() {
        console.log('tick');
        let t = Date.now() - this.startTime;

        for(let animation of this.animations) {
            // 时间超过了延迟和事件间隔，就停下来
            // if(t > animation.duration + animation.delay) {
            //     continue;
            // }

            let {object, property, template, start, end, duration, delay, timingFunction} = animation;
            let progression = timingFunction((t - delay) / duration);  // 0 - 1之间

            if(t > animation.duration + animation.delay) {
                progression = 1;
            }

            let value = start + progression * (end - start);  // 根据 progression 算出当前的位置

            object[property] = template(value);
        }

        requestAnimationFrame(() => this.tick())
    }

    start() {
        this.startTime = Date.now();
        this.tick();
    }

    add(animation) {
        this.animations.push(animation);
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
}

