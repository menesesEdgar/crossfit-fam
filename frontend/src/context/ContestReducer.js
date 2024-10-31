const contestReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CONTEST":
      return {
        ...state,
        categories: action.payload?.contestCategory?.map((category) => {
          return {
            ...category.category,
            ["conCatId"]: category.id,
          };
        }),
        wods: action.payload?.contestWod?.map((wod) => {
          return {
            ...wod.wod,
            ["conWodId"]: wod.id,
          };
        }),
        contest: {
          ...action.payload,
          contestCategory: action.payload?.contestCategory?.map((category) => {
            return {
              ...category.category,
              ["conCatId"]: category.id,
            };
          }),
          contestWod: action.payload?.contestWod?.map((wod) => {
            return {
              ...wod.wod,
              ["conWodId"]: wod.id,
            };
          }),
        },
        loading: false,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        category: action.payload,
        categories: [
          ...state.categories,
          {
            ...action.payload.category,
            ["conCatId"]: action.payload.id,
          },
        ],
        loading: false,
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: action.payload?.contestCat
          ? action.payload?.contestCat?.map((category) => {
              return {
                ...category.category,
                ["conCatId"]: category.id,
              };
            })
          : [],
        loading: false,
      };
    case "ADD_WOD":
      return {
        ...state,
        wod: action.payload,
        wods: [
          ...state.wods,
          {
            ...action.payload.wod,
            ["conWodId"]: action.payload.id,
          },
        ],
        loading: false,
      };
    case "DELETE_WOD":
      return {
        ...state,
        wods: action.payload?.contestWod
          ? action.payload?.contestWod?.map((wod) => {
              return {
                ...wod.wod,
                ["conWodId"]: wod.id,
              };
            })
          : [],
        loading: false,
      };
    case "ADD_WOD_CATEGORY":
      return {
        ...state,
        categoryWod: action.payload,
        categoryWods: [
          ...state.categories,
          {
            ...action.payload.category,
            ["conCatId"]: action.payload.id,
          },
        ],
        loading: false,
      };
    case "DELETE_WOD_CATEGORY":
      return {
        ...state,
        categoryWods: action.payload?.contestCat
          ? action.payload?.contestCat?.map((category) => {
              return {
                ...category.category,
                ["conCatId"]: category.id,
              };
            })
          : [],
        loading: false,
      };
    case "ADD_ALL_CATEGORIES":
      return {
        ...state,
        categories: action.payload.map((category) => {
          return {
            ...category.category,
            ["conCatId"]: category.id,
          };
        }),
        loading: false,
      };
    case "REMOVE_ALL_CATEGORIES":
      return {
        ...state,
        categories: [],
        loading: false,
      };
    case "ADD_ALL_WODS":
      return {
        ...state,
        wods: action.payload.map((wod) => {
          return {
            ...wod.wod,
            ["conWodId"]: wod.id,
          };
        }),
        loading: false,
      };
    case "REMOVE_ALL_WODS":
      return {
        ...state,
        wods: [],
        loading: false,
      };
    default:
      return state;
  }
};

export default contestReducer;
