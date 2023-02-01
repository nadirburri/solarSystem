import { useContext, useEffect, useRef } from 'react';
import { Context } from './PlanetContext'

export default function CanvasStars() {
    const context = useContext(Context)


    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const c = canvasRef.current.getContext('2d')
        contextRef.current = c

        const handleResize = e => {
            c.canvas.height = window.innerHeight;
            c.canvas.width = window.innerWidth
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    let frame, lastFrameTime
    useEffect(() => {
        const c = contextRef.current
        const canvas = c.canvas

        // GENERATE RANDOMIZED STARS
        let starInfo = []
        for (let i = 0; i < 1800; i++) {
            let x = Math.floor(Math.random() * canvas.width * 9) - canvas.width * 3.75;
            let y = Math.floor(Math.random() * canvas.height * 9) - canvas.height * 3.75;
            let radius = Math.floor(Math.random()*2);

            let a = Math.round(Math.random() * 100) / 100

            let info = { x: x, y: y, radius: radius, a: a }

            starInfo.push(info)
        }

        const render = (time) => {
            if (time - lastFrameTime < 1000 / 60) {
                frame = requestAnimationFrame(() => render());
                return
            }

            c.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
            c.scale(0.2, 0.2)
            c.translate(-canvas.width / 2 + context.planetState.cameraOffset.x * 0.2, -canvas.height / 2 + context.planetState.cameraOffset.y * 0.2)

            c.save();
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.restore();

            // DRAW BACKGROUND STARS
            starInfo.forEach((info) => {
                let { x, y, radius, a } = info

                c.beginPath();
                c.arc(x, y, radius, Math.PI * 2, 0, false);
                c.fillStyle = `rgba(255, 255, 255, ${a})`
                c.fill();
                c.closePath();
            })

            frame = requestAnimationFrame(() => render())
        }
        frame = requestAnimationFrame(() => render())
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [context.planetState.reset])

    return (
        <canvas id="canvasStars" ref={canvasRef} />
    )
}