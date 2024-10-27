const contestReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_CONTEST':
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
  