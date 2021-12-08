import { combineReducers } from "redux" ;
import { mainReducer } from "./reducers/mainReducer";
export const rootReducer = combineReducers({
    main: mainReducer,
    // put the rest of reducers here
});