let utilities = {}

let AU = 149.6e6 * 1000
let G = 6.67428e-11
let SCALE = 200 / AU

export default utilities = {
    AU: AU,
    G: G,
    SCALE: SCALE,
    TIMESTEP: 14400,

    newBody: function (name, x, y, radius, realRadius, color, mass) {
        let body = Object.create(this);

        body.name = name
        body.x = x
        body.y = y
        body.radius = radius
        body.realRadius = realRadius
        body.color = color
        body.mass = mass

        body.orbit = []
        body.sun = false
        body.distanceToSun = 0

        body.vx = 0
        body.vy = 0

        return body
    },

    draw: function (c, orbit, scale, planetIcon) {
        let { x, y, radius, color } = this
        this.img = planetIcon

        x = x * SCALE
        y = y * SCALE
        radius = (!scale ? this.radius : this.realRadius * SCALE)

        this.showingScale = (!scale ? true : false)

        // DRAW ORBIT PATH OF PLANET
        if (orbit) {
            c.shadowBlur = 0
            c.shadowColor = ""
            c.beginPath()
            this.orbit.forEach((point) => {
                let { x, y } = point
                x = x * SCALE
                y = y * SCALE

                c.lineTo(x, y)
                c.strokeStyle = this.color
                c.lineWidth = 0.25

            })
            c.stroke()
            c.closePath()
        }

        // DRAW CIRCLES WHERE EACH PLANET IS AT TO ADD EFFECTS TO THEM LATER
        c.save()
        c.beginPath()
        c.arc(x, y, radius, 0, Math.PI * 2, false)

        // ADD OUTLINE
        if (this.selected) {
            c.lineWidth = 4
            c.strokeStyle = "rgb(10,189,198)"
            c.stroke()
        } else if (this.hovered) {
            c.lineWidth = 3
            c.strokeStyle = "white"
            c.stroke()
        }

        c.closePath()
        c.clip()

        // SINCE THE SUN LOOKS FINE WITH GRADIENT, DRAW IMAGES ONLY FOR PLANETS
        if (!this.sun) {
            const image = new Image()
            image.src = planetIcon
            c.drawImage(image, x - radius, y - radius, radius * 2, radius * 2)
        }
        c.restore()

        // ADD GLOW TO THE SUN AND SHADING ON EACH PLANET CAUSED BY THE SUN
        let gradient
        if (this.sun === true) {
            c.shadowBlur = 50
            c.shadowColor = "rgba(255, 255, 0, 0.5)"
            gradient = c.createLinearGradient((x - radius / 2), (y - radius / 2), (x + radius / 2), (y + radius / 2))
            gradient.addColorStop(0, "rgb(255, 252, 0)")
            gradient.addColorStop(1, "rgb(255, 81, 19)")
        } else {
            c.shadowBlur = 0
            c.shadowColor = ""
            gradient = c.createLinearGradient((x), (y - radius / 2), x, (y + radius * 1.5))
            gradient.addColorStop(0, "rgba(0, 0, 0, 0.8)")
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)")

            let theta = -Math.atan2(this.sunDistanceX, this.sunDistanceY)
            c.save()
            c.translate(x, y)
            c.rotate(theta)
            c.translate(-x, -y)
        }
        c.fillStyle = gradient;
        c.fill()
        c.closePath()
        c.restore()
    },
    
    findAttractionForce: function (body, x, y) {
        let other_x = body.x
        let other_y = body.y
        let distance_x = other_x - (x || this.x)
        let distance_y = other_y - (y || this.y)
        let distance = Math.sqrt(distance_x ** 2 + distance_y ** 2)
        if (body.sun) {
            this.distanceToSun = distance
            this.sunDistanceX = distance_x
            this.sunDistanceY = distance_y
        }
        // NEWTON'S FORMULA FOR GRAVITATIONAL ACCELERATION
        let force = G * this.mass * body.mass / distance ** 2
        let theta = Math.atan2(distance_y, distance_x)
        let fx = Math.cos(theta) * force
        let fy = Math.sin(theta) * force
        // if (distance < 40000000000) {
        //     distance = 40000000000
        // }
        return { fx, fy }
    },

    calculatePosition: function (bodies, TIMESTEP) {
        // EULER METHOD

        // let total_fx = 0
        // let total_fy = 0
        // bodies.forEach((body) => {
        //     if (this === body) {
        //         return
        //     } else {
        //         let attractionForces = this.findAttractionForce(body)
        //         total_fx += attractionForces.fx
        //         total_fy += attractionForces.fy
        //     }
        // })

        // this.vx += total_fx / this.mass * TIMESTEP
        // this.vy += total_fy / this.mass * TIMESTEP

        // this.x += this.vx * TIMESTEP
        // this.y += this.vy * TIMESTEP

        // RUNGE-KUTTA 4TH ORDER METHOD

        let k1x, k1y, k2x, k2y, k3x, k3y, k4x, k4y
        let l1x, l1y, l2x, l2y, l3x, l3y, l4x, l4y
        let total_fx = 0
        let total_fy = 0

        // FIRST ITERATION
        bodies.forEach((body) => {
            if (this === body) {
                return
            } else {
                let attractionForces = this.findAttractionForce(body)
                total_fx += attractionForces.fx
                total_fy += attractionForces.fy
            }
        })

        k1x = total_fx / this.mass * TIMESTEP
        k1y = total_fy / this.mass * TIMESTEP
        l1x = this.vx * TIMESTEP
        l1y = this.vy * TIMESTEP

        // SECOND ITERATION
        total_fx = 0
        total_fy = 0
        bodies.forEach((body) => {
            if (this === body) {
                return
            } else {
                let attractionForces = this.findAttractionForce(body, this.x + l1x / 2, this.y + l1y / 2)
                total_fx += attractionForces.fx
                total_fy += attractionForces.fy
            }
        })

        k2x = total_fx / this.mass * TIMESTEP
        k2y = total_fy / this.mass * TIMESTEP
        l2x = (this.vx + k1x / 2) * TIMESTEP
        l2y = (this.vy + k1y / 2) * TIMESTEP

        // THIRD ITERATION
        total_fx = 0
        total_fy = 0
        bodies.forEach((body) => {
            if (this === body) {
                return
            } else {
                let attractionForces = this.findAttractionForce(body, this.x + l2x / 2, this.y + l2y / 2)
                total_fx += attractionForces.fx
                total_fy += attractionForces.fy
            }
        })

        k3x = total_fx / this.mass * TIMESTEP
        k3y = total_fy / this.mass * TIMESTEP
        l3x = (this.vx + k2x / 2) * TIMESTEP
        l3y = (this.vy + k2y / 2) * TIMESTEP

        // FOURTH ITERATION
        total_fx = 0
        total_fy = 0
        bodies.forEach((body) => {
            if (this === body) {
                return
            } else {
                let attractionForces = this.findAttractionForce(body, this.x + l3x, this.y + l3y)
                total_fx += attractionForces.fx
                total_fy += attractionForces.fy
            }
        })

        k4x = total_fx / this.mass * TIMESTEP
        k4y = total_fy / this.mass * TIMESTEP
        l4x = (this.vx + k3x) * TIMESTEP
        l4y = (this.vy + k3y) * TIMESTEP

        // UPDATE POSITION AND VELOCITY WITH THE AVERAGE OF THE CALCULATED VALUES
        this.x = this.x + (l1x + 2 * l2x + 2 * l3x + l4x) / 6
        this.y = this.y + (l1y + 2 * l2y + 2 * l3y + l4y) / 6
        this.vx = this.vx + (k1x + 2 * k2x + 2 * k3x + k4x) / 6
        this.vy = this.vy + (k1y + 2 * k2y + 2 * k3y + k4y) / 6

        // ADD POINTS EACH FRAME THAT WILL BE CONNECTED TO FORM THE ORBIT PATH FOR EACH PLANET (IF TURNED ON)
        if (this.name !== "Sun") {
            let points = { x: this.x, y: this.y }
            this.orbit.push(points)

            if (this.orbit.length > 400) {
                this.orbit.shift()
            }
        }
    },
    findDistanceFromMouse: function (body, mouse, c) {
        const transform = c.getTransform();

        const distanceX = (mouse.x * (1 / transform.a) - (body.x * SCALE)) - transform.e * (1 / transform.a)
        const distanceY = (mouse.y * (1 / transform.d) - (body.y * SCALE)) - transform.f * (1 / transform.d)

        const distance = distanceX ** 2 + distanceY ** 2

        if (distance < (body.showingScale ? body.radius : body.realRadius * SCALE) ** 2) {
            body.hovered = true
            return true
        } else {
            body.hovered = false
            return false
        }
    },
    dragBody: function (selectedPlanet, mouse, c) {
        const transform = c.getTransform();

        const transformedMouseX = (mouse.x * (1 / transform.a) - transform.e * (1 / transform.a)) / SCALE
        const transformedMouseY = (mouse.y * (1 / transform.d) - transform.f * (1 / transform.d)) / SCALE

        selectedPlanet.x = transformedMouseX
        selectedPlanet.y = transformedMouseY

        selectedPlanet.dragging = true
    }
}