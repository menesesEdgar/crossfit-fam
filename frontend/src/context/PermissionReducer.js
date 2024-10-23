const PermissionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
        loading: false,
      };
    case 'GET_PERMISSION':
      return {
        ...state,
        permission: action.payload,
        loading: false,
      };
    case 'CREATE_PERMISSION':
      return {
        ...state,
        permission: action.payload,
        permissions: [...state.permissions, action.payload],
        loading: false,
      };
    case 'UPDATE_PERMISSION':
      return {
        ...state,
        permission: action.payload,
        permissions: state.permissions.map((permission) =>
          permission.id === action.payload.id ? action.payload : permission,
        ),
        loading: false,
      };
    case 'DELETE_PERMISSION':
      return {
        ...state,
        permissions: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default PermissionReducer;
