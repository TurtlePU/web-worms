import { dim } from './const';

class GraphicsEngine {
    private canvas: HTMLCanvasElement;

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = dim.width;
        this.canvas.height = dim.height;
    }

    render() {
        // TODO: render
    }
}

export const Graphics = new GraphicsEngine();
