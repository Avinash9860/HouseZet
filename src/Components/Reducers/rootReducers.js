import { combineReducers } from "redux";
import addUser from "./addUserReducer";

const rootReducer = combineReducers({
  user: addUser,
});
export default rootReducer;
