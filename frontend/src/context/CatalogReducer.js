const CatalogReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ATHLETES":
      return {
        ...state,
        athletes: action.payload,
        loading: false,
      };
    case "FETCH_ATHLETE":
      return {
        ...state,
        athlete: action.payload,
        loading: false,
      };
    case "CREATE_ATHLETE":
      return {
        ...state,
        athlete: action.payload,
        athletes: [...state.athletes, action.payload],
        loading: false,
      };
    case "UPDATE_ATHLETE":
      return {
        ...state,
        athlete: action.payload,
        athletes: state.athletes.map((athlete) =>
          athlete.id === action.payload.id ? action.payload : athlete
        ),
        loading: false,
      };
    case "DELETE_ATHLETE":
      return {
        ...state,
        athletes: action.payload,
        loading: false,
      };
    case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };
    case "FETCH_CATEGORY":
      return {
        ...state,
        category: action.payload,
        loading: false,
      };
    case "CREATE_CATEGORY":
      return {
        ...state,
        category: action.payload,
        categories: [...state.categories, action.payload],
        loading: false,
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        category: action.payload,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        loading: false,
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };
    case "FETCH_WODS":
      return {
        ...state,
        wods: action.payload,
        loading: false,
      };
    case "FETCH_WOD":
      return {
        ...state,
        wod: action.payload,
        loading: false,
      };
    case "CREATE_WOD":
      return {
        ...state,
        wod: action.payload,
        wods: [...state.wods, action.payload],
        loading: false,
      };
    case "UPDATE_WOD":
      return {
        ...state,
        wod: action.payload,
        wods: state?.wods?.map((wod) =>
          wod.id === action.payload.id ? action.payload : wod
        ),
        loading: false,
      };
    case "DELETE_WOD":
      return {
        ...state,
        wods: action.payload,
        loading: false,
      };
    case "FETCH_CONTESTS":
      return {
        ...state,
        contests: action.payload,
        loading: false,
      };
    case "CREATE_CONTEST":
      return {
        ...state,
        contest: action.payload,
        contests: [...state.contests, action.payload],
        loading: false,
      };
    case "UPDATE_CONTEST":
      return {
        ...state,
        contest: action.payload,
        contests: state?.contests?.map((contest) =>
          contest.id === action.payload.id ? action.payload : contest
        ),
        loading: false,
      };
    case "DELETE_CONTEST":
      return {
        ...state,
        contests: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default CatalogReducer;
