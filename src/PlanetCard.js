import { useContext, useEffect, useState } from "react"
import { Context } from './PlanetContext'

import mercuryImg from "./images/mercury.png"
import venusImg from "./images/venus.png"
import earthImg from "./images/earth.png"
import marsImg from "./images/mars.png"
import jupiterImg from "./images/jupiter.png"
import saturnImg from "./images/saturn.png"
import neptuneImg from "./images/neptune.png"
import uranusImg from "./images/uranus.png"

export default function PlanetCard() {
    const context = useContext(Context)
    const [selectedPlanet, setSelectedPlanet] = useState({})

    useEffect(() => {
        setSelectedPlanet(context.planetState.selectedPlanet)
        console.log()
    }, [context])

    // wizard code
    String.prototype.expandExponential = function(){
        return this.replace(/^([+-])?(\d+).?(\d*)[eE]([-+]?\d+)$/, function(x, s, n, f, c){
            var l = +c < 0, i = n.length + +c, x = (l ? n : f).length,
            c = ((c = Math.abs(c)) >= x ? c - x + l : 0),
            z = (new Array(c + 1)).join("0"), r = n + f;
            return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
        });
    };

    function roundNumber(num) {
        let numString = num.toString();
        let firstFiveDigits = numString.slice(0, 5);
        return parseInt(firstFiveDigits + '0'.repeat(numString.length - 5));
      }

    return (
        <div className={selectedPlanet.name ? "planetCardActive" : "planetCardHidden"}>
            {
                selectedPlanet.name
                    ? <>
                        <div className="planetCardCnt1">
                            {
                                selectedPlanet.sun
                                ? <div className="sunIcon"></div>
                                : <img src={selectedPlanet.img} alt="planetImg" />
                            }
                        </div>
                        <div className="planetCardCnt2">
                            <h2 style={{color: selectedPlanet.color}}>{selectedPlanet.name}</h2>
                            <p>{selectedPlanet.description}</p>
                        </div>
                        <div className="planetCardCnt3">
                            <h2 className="massNum">Mass: <span>{(Math.round((parseInt((selectedPlanet.mass+'').expandExponential()) / (10 ** parseInt((selectedPlanet.mass+'').expandExponential().length))) * 10 ** 6) / 10 ** 5)} * 10<sup>{parseInt((selectedPlanet.mass+'').expandExponential().length) - 1}</sup> kg</span></h2>
                            {/* <h2 className="massNum">Mass: <span>{String(roundNumber(String(selectedPlanet.mass).expandExponential())).expandExponential()}kg</span></h2> */}
                            <div className="buttons">
                                <button onClick={() => context.dispatch({ type: "CHANGE_MASS", payload: 0.1 })}>0.1x</button>
                                <button onClick={() => context.dispatch({ type: "CHANGE_MASS", payload: 0.5 })}>0.5x</button>
                                <button onClick={() => context.dispatch({ type: "CHANGE_MASS", payload: 2 })}>2x</button>
                                <button onClick={() => context.dispatch({ type: "CHANGE_MASS", payload: 10 })}>10x</button>
                            </div>
                        </div>
                    </>
                    : <></>
            }
        </div>
    )


}   