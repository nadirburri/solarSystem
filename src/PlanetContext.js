import React, { useReducer } from "react";
import { reducer } from "./Reducer"

const initialState = {
    GUI: false,
    showOrbit: false,
    showRealScale: false,
    reset: false,
    TIMESTEP: 14400,
    cameraZoom: 1,
    cameraOffset: {x: 0, y: 0},
    selectedPlanet: {},
}

export const Context = React.createContext()

const PlanetContext = ( {children} ) => {
    const [planetState, dispatch] = useReducer(reducer, initialState)

    return (
        <Context.Provider value={{
            planetState: planetState,
            dispatch: dispatch,
        }}>
            { children }
        </Context.Provider>
    )
}

export default PlanetContext