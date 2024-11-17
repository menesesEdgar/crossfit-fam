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
    case "FETCH_CONTESTS": {
      const { id: userId } = action.payload?.user
      const updatedContests = action.payload?.data?.map((contest) => {
        const allAthletes = contest.categories?.reduce((acc, contest) => {
          return acc.concat(contest.contestCategoryAthlete);
        }, []);
        const findUserRegister = allAthletes.find((athlete) => athlete.userId === userId)
        return {
          ...contest,
          athletes: allAthletes,
          isRegistered: allAthletes?.length > 0 ? !!findUserRegister : false,
          registerId: findUserRegister ? findUserRegister?.id : null
        }
      })

      return {
        ...state,
        contests: updatedContests,
        loading: false,
      };
      
    }

    case "DELETE_ATHLETE_FROM_CONTEST": {
      const currentContests = state.contests
        const newContestIndex = state.contests.findIndex((contest) => contest.id === parseInt(action.payload.data.contestId))
        if (newContestIndex !== -1) {
          const currentContest = currentContests[newContestIndex]
          if (currentContest.isRegistered && action.payload?.data?.athletes) {
            const updatedContest = {
              ...currentContest,
              athletes: [...action.payload.data.athletes],
              isRegistered: false,
              registerId: null
            }
            currentContests[newContestIndex] = updatedContest
          }

        }
    return {
      ...state,
      contests: currentContests,
      loading: false,
    };
    }    
    case "ADD_ATHLETE_TO_CONTEST":
      {
        const contestId = action.payload?.contestCategory?.contestId
        const currentContests = state.contests
        if (contestId) {
          const newContestIndex = state.contests.findIndex((contest) => contest.id === parseInt(contestId))
          if (newContestIndex !== -1) {
            const currentContest = currentContests[newContestIndex]
            if (!currentContest.isRegistered) {
              const updatedContest = {
                ...currentContest,
                athletes: [...currentContest.athletes, action.payload],
                isRegistered: true,
                registerId: action.payload?.id
              }
              currentContests[newContestIndex] = updatedContest
            }
  
          }
        }
        return {
          ...state,
          contests: currentContests,
          loading: false,
        };
      }

    case "FETCH_CONTEST":
      return {
        ...state,
        contest: action.payload,
        loading: false,
      };
    case "FETCH_PUBLIC_CONTESTS":
      return {
        ...state,
        publicContests: action.payload,
        loading: false,
      };
    case "FETCH_PUBLIC_CONTEST":
      return {
        ...state,
        publicContest: action.payload,
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
