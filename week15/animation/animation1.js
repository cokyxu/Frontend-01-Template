export class Timeline
{
    constructor() {
        this.animations = [];
    }

    tick() {
        console.log('tick');
        let t = Date.now() - this.startTime;

        for(let animation of this.animations) {
            if(t > animation.duration + animation.delay) {
                continue;
            }

            let {object, property, template, start, end, duration, delay, timingFunction} = animation;
            object[property] = template(timingFunction(start, end)(t - delay));
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
        this.delay = delay || 0
        this.timingFunction = timingFunction || ((start, end) => {
            return (t) => start + (t / duration) * (end - start)
        })
    }
}

