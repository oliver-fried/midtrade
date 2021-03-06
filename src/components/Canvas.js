import React from "react";

const scaleWidth = 500;
const scaleHeight = 500;

function draw(canvas, scaleX, scaleY) {
    const context = canvas.getContext("2d");
    context.scale(scaleX, scaleY);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.beginPath();
    context.setLineDash([]);
    context.lineWidth = 2;
    context.strokeStyle = "red";
    context.moveTo(0, 100);
    context.lineTo(scaleWidth, 100);
    context.moveTo(0, 400);
    context.lineTo(scaleWidth, 400);
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "blue";
    context.fillStyle = "blue";
    context.rect(200, 200, 100, 100);
    context.fill();
    context.closePath();
}

export function CanvasDraw() {
    const [scale, setScale] = React.useState({ x: 1, y: 1 });
    const canvas = React.useRef(null);

    const calculateScaleX = () => (!canvas.current ? 0 : canvas.current.clientWidth / scaleWidth);
    const calculateScaleY = () => (!canvas.current ? 0 : canvas.current.clientHeight / scaleHeight);

    const resized = () => {
        canvas.current.width = canvas.current.clientWidth;
        canvas.current.height = canvas.current.clientHeight;
        setScale({ x: calculateScaleX(), y: calculateScaleY() });
    };

    React.useEffect(() => resized(), []);

    React.useEffect(() => {
        const currentCanvas = canvas.current;
        currentCanvas.addEventListener("resize", resized);
        return () => currentCanvas.removeEventListener("resize", resized);
    });

    React.useEffect(() => {
        draw(canvas.current, scale.x, scale.y);
    }, [scale]);

    return <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />;
}

export default CanvasDraw;