const RoleReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ROLES':
      return {
        ...state,
        roles: action.payload,
        loading: false,
      };
    case 'GET_ROLE':
      return {
        ...state,
        role: action.payload,
        loading: false,
      };
    case 'CREATE_ROLE':
      return {
        ...state,
        role: action.payload,
        roles: [...state.roles, action.payload],
        loading: false,
      };
    case 'UPDATE_ROLE':
      return {
        ...state,
        role: action.payload,
        roles: state.roles.map((role) =>
          role.id === action.payload.id ? action.payload : role,
        ),
        loading: false,
      };
    case 'DELETE_ROLE':
      return {
        ...state,
        roles: state.roles.filter((role) => role.id !== action.payload),
        loading: false,
      };
    case 'GET_ROLE_PERMISSIONS':
      return {
        ...state,
        rolePermissions: action.payload,
        loading: false,
      };
    case 'GET_ROLE_PERMISSION_BY_ROLE_ID':
      return {
        ...state,
        rolePermissions: action.payload,
        loading: false,
      };
    case 'CREATE_ROLE_PERMISSION':
      return {
        ...state,
        rolePermissions: [...state.rolePermissions, action.payload],
        loading: false,
      };
    case 'DELETE_ROLE_PERMISSION':
      return {
        ...state,
        rolePermissions: state.rolePermissions.filter(
          (rolePermission) => rolePermission.id !== action.payload.id,
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default RoleReducer;
