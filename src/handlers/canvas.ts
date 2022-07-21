import { CanvasRenderingContext2D, Canvas } from 'canvas';
import log from './log';

class circle {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    end() {
        this.context.beginPath();
        this.context.arc(this.x + this.size, this.y + this.size, this.size, 0, Math.PI * 2, true);
        if (this.clip) {
            this.context.closePath();
            this.context.clip();
        } else {
            this.context.fillStyle = this.color;
            this.context.fill();
        }
    }
    setClip(clip: boolean) {
        this.clip = clip;
        return this;
    }
    setColor(color: string) {
        this.color = color;
        return this;
    }
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    setSize(size: number) {
        this.size = size / 2;
        return this;
    }
    clip: boolean;
    color: string;
    context: CanvasRenderingContext2D;
    size: number;
    x: number;
    y: number;
}

class progressBar {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    end() {
        if (!this.context) return new log().error(new Error('Context must be set.'));
        let minWidth = 0;
        if (this.width * this.percent < (this.radius * 1.5)) {
            minWidth = (this.radius * 1.5) - (this.width * this.percent);
        }
        new rectangle(this.context).setColor(this.color).setPosition(this.x, this.y).setRadius(this.radius).setSize((this.width * this.percent) + minWidth, this.height).end();
        if (this.text) {
            new text(this.context)
                .setText(this.text)
                .setColor(this.textColor)
                .setFormating({ font: this.textFont, align: 'center', stroke: true, maxWidth: this.width / 2.1 })
                .setPosition(this.x + (this.width / 2), this.y + (this.height - (this.height / 5.25)))
                .end()
        }
    }
    setColor(color: string) {
        this.color = color;
        return this;
    }
    setPercent(percent: number) {
        this.percent = percent;
        return this;
    }
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        return this;
    }
    setText(text: string, font: string, color: string) {
        this.text = text;
        this.textFont = font;
        this.textColor = color;
        return this;
    }
    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }
    color: string;
    context: CanvasRenderingContext2D;
    height: number;
    percent: number;
    radius: number;
    text: string;
    textColor: string;
    textFont: string;
    width: number;
    x: number;
    y: number;
}

class rectangle {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    end() {
        this.radius = this.radius | 0.001;
        let r = this.x + this.width;
        let b = this.y + this.height;
        this.context.beginPath();
        this.context.moveTo(this.x + this.radius, this.y);
        this.context.lineTo(r - this.radius, this.y);
        this.context.quadraticCurveTo(r, this.y, r, this.y + this.radius);
        this.context.lineTo(r, this.y + this.height - this.radius);
        this.context.quadraticCurveTo(r, b, r - this.radius, b);
        this.context.lineTo(this.x + this.radius, b);
        this.context.quadraticCurveTo(this.x, b, this.x, b - this.radius);
        this.context.lineTo(this.x, this.y + this.radius);
        this.context.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        if (this.clip) {
            this.context.closePath();
            this.context.clip();
        } else {
            this.context.fillStyle = this.color;
            this.context.fill();
        }
    }
    setClip(clip: boolean) {
        this.clip = clip;
        return this;
    }
    setColor(color: string) {
        this.color = color;
        return this;
    }
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        return this;
    }
    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }
    clip: boolean;
    color: string;
    context: CanvasRenderingContext2D;
    height: number;
    radius: number;
    width: number;
    x: number;
    y: number;
}

class scaleFont {
    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }
    end() {
        this.size = this.size | 110;
        const context = this.canvas.getContext('2d');
        do {
            context.font = `${this.size -= 2}px ${this.font}`;
        } while (context.measureText(this.text).width > this.canvas.width - this.number);

        return context.font;
    }
    setFormating(options: { font?: string, size?: number, number: number }) {
        this.font = options.font;
        this.number = options.number;
        this.size = options.size;
        return this;
    }
    setText(text: string) {
        this.text = text;
        return this;
    }
    canvas: Canvas;
    font: string;
    number: number;
    size: number = 110;
    text: string;
}

class text {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    end() {
        if (!this.context) return new log().error(new Error('Context must be set.'));
        if (this.font) this.context.font = this.font;
        if (this.size) this.context.font = `${this.size}px`;
        if (this.font && this.size) this.context.font = `${this.size}px ${this.font}`;
        if (this.color) this.context.fillStyle = this.color;
        if (this.align) this.context.textAlign = this.align;
        this.context.fillText(this.text, this.x, this.y, this.maxWidth);
        if (this.stroke) this.context.strokeText(this.text, this.x, this.y, this.maxWidth);
    }
    setColor(color: string) {
        this.color = color;
        return this;
    }
    setFormating(options: { align?: CanvasTextAlign, font?: string, maxWidth?: number, size?: number, stroke?: boolean }) {
        this.align = options.align;
        this.font = options.font;
        this.maxWidth = options.maxWidth;
        this.size = options.size;
        this.stroke = options.stroke;
        return this;
    }
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    setText(text: string) {
        this.text = text;
        return this;
    }
    align: CanvasTextAlign;
    color: string | CanvasGradient | CanvasPattern;
    context: CanvasRenderingContext2D;
    font: string;
    maxWidth: number;
    size: number;
    stroke: boolean;
    text: string;
    x: number;
    y: number;
}

export { circle, progressBar, rectangle, scaleFont, text }
