"use client";

import { getCookie } from "cookies-next";
import { useMemo, useEffect, useReducer, useCallback } from "react";

import { COOKIES_KEYS } from "@/config-global";
import { User, logUserOut } from "@/actions/auth-methods";

import { AuthContext } from "./auth-context";
import { AuthUserType, ActionMapType, AuthStateType } from "../../types";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------
type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    const access_token = getCookie(COOKIES_KEYS.session) || "";
    const storedUser = getCookie(COOKIES_KEYS.user) || "";

    let user;

    if (storedUser) {
      user = JSON.parse(storedUser);
    }

    if (access_token && user) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user,
        },
      });
    } else {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (data: User) => {
    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...data,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await logUserOut();

    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      //
      login,
      logout,
    }),
    [login, logout, state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
