import React, { useEffect, useRef, useContext } from 'react';
import { Context } from './PlanetContext'

// FUNCTIONS AND CONSTANTS THAT WILL BE USED
import utilities from "./utilities"

// PLANET ICONS FOR EACH PLANET
import mercuryImg from "./images/mercury.png"
import venusImg from "./images/venus.png"
import earthImg from "./images/earth.png"
import marsImg from "./images/mars.png"
import jupiterImg from "./images/jupiter.png"
import saturnImg from "./images/saturn.png"
import neptuneImg from "./images/neptune.png"
import uranusImg from "./images/uranus.png"

export default function Canvas() {
    const context = useContext(Context)

    const { AU } = utilities

    let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
    let bodies = []

    // 4 useEffect() FUNCTIONS:
    // 1) INITILAZOR FOR VALUES
    // 2) CALCULATOR FOR NEW POSITIONS AND VELICITIES FOR EACH PLANET
    // 3) RENDERER FOR NEW CANVAS MATRIX
    // 4) RENDERER FOR EACH PLANET

    // useEffect INITIALIZOR
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    let SCROLL_SENSITIVITY = 0.0005
    let cameraOffset
    let cameraZoom
    let MAX_ZOOM
    let MIN_ZOOM
    let lastZoom
    let isDragging
    let dragStart
    let draggingBody
    useEffect(() => {
        SCROLL_SENSITIVITY = 0.0005
        cameraOffset = 0
        cameraZoom = 1
        MAX_ZOOM = 100
        MIN_ZOOM = 0.1
        lastZoom = 0
        isDragging = false
        dragStart = { x: 0, y: 0 }
        draggingBody = false

        sun = utilities.newBody("Sun", 0, 0, 30, 0.00465047 * AU, "yellow", 1.98892 * 10 ** 30)
        sun.sun = true
        sun.description = "The Sun is a 4.5 billion-year-old yellow dwarf star at the center of our solar system. It's about 150 million kilometers from Earth and it's our solar system's only star. Without the Sun's energy, life as we know it could not exist on our home planet."

        mercury = utilities.newBody("Mercury", -0.387 * AU, 0, 4, 0.00001629879 * AU, "rgb(127,127,127)", 3.30000 * 10 ** 23)
        mercury.vy = 47400
        mercury.description = "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets."

        venus = utilities.newBody("Venus", -0.723 * AU, 0, 10, 0.0000404532 * AU, "rgb(224,152,72)", 4.86850 * 10 ** 24)
        venus.vy = 35020
        venus.description = "Venus is the second planet from the Sun. It is sometimes called Earth's 'sister' or 'twin' planet as it is almost as large and has a similar composition. As an interior planet to Earth, Venus (like Mercury) appears in Earth's sky never far from the Sun, either as morning star or evening star."

        earth = utilities.newBody("Earth", -1 * AU, 0, 13, 0.00004258689 * AU, "rgb(0, 98, 255)", 5.97420 * 10 ** 24)
        earth.vy = 29783
        earth.description = "Earth is our home planet and the third from the Sun. It is one of four terrestrial planets in the Solar System. Being around 13,000 km in diameter, it is the largest of the terrestrial planets. It is the only planet in the Solar System that is in the habitable zone, a region around a star where liquid water can exist."

        mars = utilities.newBody("Mars", -1.524 * AU, 0, 8, 0.00002265708 * AU, "rgb(168,136,104)", 6.39000 * 10 ** 23)
        mars.vy = 24077
        mars.description = "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, only being larger than Mercury. In the English language, Mars is named for the Roman god of war."

        jupiter = utilities.newBody("Jupiter", -5.204 * AU, 0, 23, 0.00046731951 * AU, "rgb(199,152,126)", 1898.13 * 10 ** 24)
        jupiter.vy = 13060
        jupiter.description = "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun."

        saturn = utilities.newBody("Saturn", -9.573 * AU, 0, 20, 0.00038925133 * AU, "rgb(248,208,128)", 568.320 * 10 ** 24)
        saturn.vy = 9680
        saturn.description = "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Like fellow gas giant Jupiter, Saturn is a massive ball made mostly of hydrogen and helium. Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturn's. Saturn also has dozens of moons."

        uranus = utilities.newBody("Uranus", -19.165 * AU, 0, 17, 0.00016953208 * AU, "rgb(200,232,240)", 86.8110 * 10 ** 24)
        uranus.vy = 6800
        uranus.description = "Uranus is one of two ice giants in the outer solar system. Most of the planet's mass is made up of a hot dense fluid of icy materials – water, methane, and ammonia – above a small rocky core. Near the core, it heats up to 4,982 degrees Celsius."

        neptune = utilities.newBody("Neptune", -30.178 * AU, 0, 16, 0.00016458556 * AU, "rgb(72,104,248)", 102.4090 * 10 ** 24)
        neptune.vy = 5430
        neptune.description = "Neptune is dark, cold, and windy. It's the last of planets in our solar system. The composition of Neptune is similar to Uranus – ice and rock with about 15% hydrogen and a little helium. Its atmosphere is made up of hydrogen, helium, and methane."
        const c = canvasRef.current.getContext('2d')
        contextRef.current = c

        const handleResize = e => {
            c.canvas.height = window.innerHeight;
            c.canvas.width = window.innerWidth
            context.planetState.cameraOffset = { x: c.canvas.width / 2, y: c.canvas.height / 2 }
        }
        handleResize()

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", getMouseCoords)
        canvasRef.current.addEventListener("mousedown", selectPlanet)
        canvasRef.current.addEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY))
        canvasRef.current.addEventListener('mousedown', (e) => startDraggingScreen(e))
        canvasRef.current.addEventListener('mousemove', (e) => dragScreen(e))
        canvasRef.current.addEventListener('mouseup', (e) => stopDraggingScreen(e))

        context.planetState.sun = sun
        context.planetState.mercury = mercury
        context.planetState.venus = venus
        context.planetState.earth = earth
        context.planetState.mars = mars
        context.planetState.jupiter = jupiter
        context.planetState.saturn = saturn
        context.planetState.uranus = uranus
        context.planetState.neptune = neptune

        bodies = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]

        const loop = setInterval(function () {
            const bodies = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]
            bodies.forEach((body) => {
                utilities.findDistanceFromMouse(body, mouseCoords, contextRef.current, context.planetState.showRealScale)
            })
            if (draggingBody) {
                utilities.dragBody(hoveredBody, mouseCoords, contextRef.current)
            }
        }, 10)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", getMouseCoords)
            canvasRef.current.removeEventListener('mousedown', (e) => startDraggingScreen(e))
            canvasRef.current.removeEventListener('mousemove', (e) => dragScreen(e))
            canvasRef.current.removeEventListener('mouseup', (e) => stopDraggingScreen(e))
            canvasRef.current.removeEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY))
            canvasRef.current.removeEventListener("mousedown", selectPlanet)
            clearInterval(loop)
        }
    }, [context.planetState.reset])

    let mouseCoords = { x: 0, y: 0 }
    const getMouseCoords = (mouse) => {
        mouseCoords.x = mouse.x
        mouseCoords.y = mouse.y
    }

    const startDraggingScreen = (e) => {
        if (!context.planetState.hovering) {
            isDragging = true
            dragStart.x = e.screenX / context.planetState.cameraZoom - context.planetState.cameraOffset.x
            dragStart.y = e.screenY / context.planetState.cameraZoom - context.planetState.cameraOffset.y
        }
    }

    const dragScreen = (e) => {
        if (isDragging) {
            context.planetState.cameraOffset.x = e.screenX / context.planetState.cameraZoom - dragStart.x
            context.planetState.cameraOffset.y = e.screenY / context.planetState.cameraZoom - dragStart.y
        }
        context.dispatch({ type: "TURN_GUI", payload: false })
    }

    const stopDraggingScreen = (e) => {
        isDragging = false
        draggingBody = false
        lastZoom = context.planetState.cameraZoom
    }

    let hoveredBody
    const selectPlanet = () => {
        console.log(context.planetState.showRealScale)
        hoveredBody = {}
        context.planetState.hovering = false
        bodies.forEach((body) => {
            if (body.selected === true && body.hovered === true) {
                draggingBody = true
            }
            body.selected = false
            if (body.hovered === true) {
                context.planetState.hovering = true
                body.selected = true
                hoveredBody = body
            }
        })
        context.dispatch({ type: "SELECT", payload: hoveredBody })
    }

    function adjustZoom(zoomAmount, zoomFactor) {
        if (!isDragging) {
            if (zoomAmount) {
                context.planetState.cameraZoom -= zoomAmount
            }
            else if (zoomFactor) {
                console.log(zoomFactor)
                cameraZoom = zoomFactor * lastZoom
            }

            context.planetState.cameraZoom = Math.min(context.planetState.cameraZoom, MAX_ZOOM)
            context.planetState.cameraZoom = Math.max(context.planetState.cameraZoom, MIN_ZOOM)
        }
    }

    // CALCULATE NEW POSITION & FORCES ACTING ON EACH BODY
    useEffect(() => {
        bodies = [context.planetState.sun, context.planetState.mercury, context.planetState.venus, context.planetState.earth, context.planetState.mars, context.planetState.jupiter, context.planetState.saturn, context.planetState.uranus, context.planetState.neptune]
        // TWO LOOPS RUNNING AT ONCE AT 60 TIMES PER SECOND SINCE ANIMATIONFRAME DOESN'T RUN ABOVE 60FPS ON MOST MONITORS
        let frame1, frame2, lastFrameTime
        const render1 = (time) => {
            if (time - lastFrameTime < 1000 / 60) {
                frame1 = requestAnimationFrame(() => render1())
                return
            }
            lastFrameTime = time
            bodies.forEach((body) => {
                body.calculatePosition(bodies, context.planetState.TIMESTEP)
            })

            frame1 = requestAnimationFrame(() => render1())
        }
        frame1 = requestAnimationFrame(() => render1())
        const render2 = (time) => {
            if (time - lastFrameTime < 1000 / 60) {
                frame1 = requestAnimationFrame(() => render2())
                return
            }
            lastFrameTime = time
            bodies.forEach((body) => {
                body.calculatePosition(bodies, context.planetState.TIMESTEP)
            })

            frame2 = requestAnimationFrame(() => render2())
        }
        frame2 = requestAnimationFrame(() => render2())
        return () => {
            cancelAnimationFrame(frame1)
            cancelAnimationFrame(frame2)
        }
    }, [context.planetState.reset, context.planetState.TIMESTEP])

    // UPDATE THE CANVAS MATRIX EACH FRAME DEPENDANT ON ZOOM & OFFSET VALUES
    useEffect(() => {
        const c = contextRef.current
        const canvas = c.canvas

        let frame, lastFrameTime
        const render = (time) => {
            if (time - lastFrameTime < 1000 / 60) {
                frame = requestAnimationFrame(() => render());
                return
            }
            var startTime = performance.now()
            cancelAnimationFrame(frame)
            lastFrameTime = time

            // HANDLE ZOOM & PAN
            c.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
            c.scale(context.planetState.cameraZoom, context.planetState.cameraZoom)
            c.translate(-canvas.width / 2 + context.planetState.cameraOffset.x, -canvas.height / 2 + context.planetState.cameraOffset.y)

            // SCREEN REFRESH THAT SUPPORTS ZOOM & PAN
            c.save();
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.restore();

            // let innerLoopTime = performance.now() - startTime;
            // console.log(innerLoopTime)

            frame = requestAnimationFrame(() => render())
        }
        frame = requestAnimationFrame(() => render())
        return () => {
            cancelAnimationFrame(frame)
        }
    }, [context.planetState.reset])

    // DRAW EACH PLANET ON CANVAS AT THEIR CALCULATED POSITIONS EACH FRAME
    useEffect(() => {
        const c = contextRef.current

        let frame, lastFrameTime
        const render = (time) => {
            if (time - lastFrameTime < 1000 / 60) {
                frame = requestAnimationFrame(() => render());
                return
            }
            var startTime = performance.now()
            cancelAnimationFrame(frame)
            lastFrameTime = time

            context.planetState.sun.draw(c, context.planetState.showOrbit, context.planetState.showRealScale)
            context.planetState.mercury.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, mercuryImg)
            context.planetState.venus.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, venusImg)
            context.planetState.earth.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, earthImg)
            context.planetState.mars.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, marsImg)
            context.planetState.jupiter.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, jupiterImg)
            context.planetState.saturn.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, saturnImg)
            context.planetState.uranus.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, uranusImg)
            context.planetState.neptune.draw(c, context.planetState.showOrbit, context.planetState.showRealScale, neptuneImg)

            // UNCOMMENT TO SHOW PERFORMANCE ON CONSOLE (LOWER VALUES = GOOD)
            // let innerLoopTime = performance.now() - startTime;
            // console.log(innerLoopTime)

            frame = requestAnimationFrame(() => render())
        }
        frame = requestAnimationFrame(() => render())
        return () => {
            cancelAnimationFrame(frame)
        }
        // RESTART THE LOOP IF ANY OF THESE CHANGE
    }, [context.planetState.reset, context.planetState.showOrbit, context.planetState.showRealScale])

    return (
        <>
            <canvas id="canvas" ref={canvasRef} />
        </>
    );
}