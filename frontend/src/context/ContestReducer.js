const contestReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_CONTEST':
        console.log("Entry aqui")
        return {
          ...state,
          categories: action.payload?.contestCategory?.map(category => {
            return {
              ...category.category, ["conCatId"]: category.id
            }
          }),
          contest: {
            ...action.payload,
            contestCategory: action.payload?.contestCategory?.map(category => {
              return {
                ...category.category, ["conCatId"]: category.id
              }
            })
          },
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
      case 'ADD_CATEGORY':
        return {
          ...state,
          category: action.payload,
          categories: [...state.categories, {
            ...action.payload.category,
            ["conCatId"]: action.payload.id
          }],
          loading: false,
        };
      case 'DELETE_CATEGORY':
        console.log("delete cate ", action.payload)
        return {
          ...state,
          categories: action.payload?.contestCat ? action.payload?.contestCat?.map(category => {
            return {
              ...category.category, ["conCatId"]: category.id
            }
          }) : [],
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default contestReducer;
  