const contestReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_CONTEST':
        return {
          ...state,
          contest: action.payload,
          loading: false,
        };
      case 'FETCH_CONTESTS':
        return {
          ...state,
          contest: action.payload,
          loading: false,
        };
      case 'CREATE_CONTEST':
        return {
          ...state,
          contest: action.payload,
          contests: [...state.contests, action.payload],
          loading: false,
        };
      case 'UPDATE_CONTEST':
        return {
          ...state,
          contest: action.payload,
          contests: state.contests.map((contest) =>
            contest.id === action.payload.id ? action.payload : contest,
          ),
        };
      case 'DELETE_CONTEST':
        return {
          ...state,
          contest: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default contestReducer;
  