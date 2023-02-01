export const reducer = (state, action) => {
    if (action.type === "SELECT") {
        let newState = action.payload
        action.payload.selected = true
        return { ...state, selectedPlanet: action.payload }
    }
    if (action.type === "CHANGE_MASS") {
        let newState = state.selectedPlanet
        newState.mass *= action.payload
        return { ...state, payload: newState }
    }
    if (action.type === "TURN_GUI") {
        return { ...state, GUI: action.payload }
    }
    if (action.type === "TURN_ORBIT") {
        return { ...state, showOrbit: action.payload }
    }
    if (action.type === "TURN_SCALE") {
        return { ...state, showRealScale: action.payload }
    }
    if (action.type === "RESET") {
        return { ...state, reset: action.payload, selectedPlanet: {},showOrbit: false, showRealScale: false }
    }
    return state
}