import { useContext, useEffect, useState } from "react"
import { Context } from './PlanetContext'
import resetIcon from "./images/resetIcon.png"

export default function GUI() {
    const context = useContext(Context)
    const [sliderValue, setSliderValue] = useState(14400);
    const [shownValue, setShownValue] = useState(1)

    useEffect(() => {
        setSliderValue(14400)
    }, [context.planetState.reset])

    context.planetState.TIMESTEP = sliderValue

    function handleChange(e) {
        setSliderValue(e.target.value)
    }

    useEffect(() => {
        if (sliderValue == 1) {
            setShownValue("1 second => 1 second")
        } else if (sliderValue < 3600 * 12) {
            setShownValue(`1 second => ${Math.round((sliderValue / 3600 / 24 * 60) * 100) / 100} days`)
        } else if (sliderValue > 3600 * 12) {
            setShownValue(`1 second => ${Math.round((sliderValue / 3600 / 24 / 30 * 60) * 100) / 100} months`)
        }
    }, [sliderValue])

    const btnStyle = {
        backgroundImage: `url(${resetIcon})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    }

    return (
        <div className={context.planetState.GUI ? "GUIcardActive" : "GUIcardHidden"} onMouseMove={() => context.dispatch({ type: "TURN_GUI", payload: true })}>
            <p>{shownValue}</p>
            <input className="slider" type="range" min="1" max="259201" step="5400" value={sliderValue} onChange={(e) => handleChange(e)} />
            <div className="buttonCnt">
                <h3>Orbit:</h3>
                <div className={context.planetState.showOrbit ? "GUIButtonOn" : "GUIButtonOff"} onClick={() => { context.dispatch({ type: "TURN_ORBIT", payload: !(context.planetState.showOrbit) }) }} />
                <h3>Scale:</h3>
                <div className={context.planetState.showRealScale ? "GUIButtonOn" : "GUIButtonOff"} onClick={() => { context.dispatch({ type: "TURN_SCALE", payload: !(context.planetState.showRealScale) }) }} />
            </div>
            <div className="resetButton" style={btnStyle} onClick={() => { context.dispatch({ type: "RESET", payload: !(context.planetState.reset) }) }}/>
        </div>
    )
}   