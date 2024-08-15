const initialState = {
  user: null,
};

const addUser = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_USER":
      return (state.user = action.data);
    default:
      return state;
  }
};
export default addUser;
