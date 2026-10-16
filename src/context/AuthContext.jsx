import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    let mounted = true;
    let subscription;


    async function initializeAuth() {

      try {

        if (!supabase) {
          console.warn("Supabase is not configured; authentication is unavailable.");
          return;
        }


        const {
          data,
          error,
        } = await supabase.auth.getSession();


        if (error) {
          console.error(
            "Session error:",
            error
          );
        }


        if (mounted) {

          const currentSession = data?.session ?? null;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

        }



        const authListener =
          supabase.auth.onAuthStateChange(
            (_event, newSession) => {

              if (!mounted) return;


              setSession(newSession);
              setUser(newSession?.user ?? null);

            }
          );


        subscription =
          authListener.data.subscription;


      } catch (error) {

        console.error(
          "Auth setup failed:",
          error
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    }


    initializeAuth();



    return () => {

      mounted = false;

      if (subscription) {
        subscription.unsubscribe();
      }

    };


  }, []);



  async function logout() {
    if (!supabase) {
      return { success: true, error: null };
    }

    try {

      const { error } =
        await supabase.auth.signOut();


      if (error) {

        return {
          success: false,
          error,
        };

      }


      return {
        success: true,
        error: null,
      };


    } catch (error) {

      return {
        success: false,
        error,
      };

    }

  }



  return (

    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        logout,
        isAuthenticated: !!user,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth() {

  const context = useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

}
