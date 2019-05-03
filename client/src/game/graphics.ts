import { Physics } from './physics.js';

// TODO: graphics engine
class GraphicsEngine {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    render() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        Physics.circles.forEach(circle => {
            this.context.fillStyle = circle.type;
            this.context.beginPath();
            this.context.arc(
                circle.c.x, circle.c.y,
                circle.r, 0, 2 * Math.PI
            );
            this.context.fill();
        })
    }
}

export const Graphics = new GraphicsEngine();
