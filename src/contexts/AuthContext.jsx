import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Foydalanuvchi ro'yxatdan o'tkazish
  const signup = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Foydalanuvchi profilini yangilash
      await updateProfile(result.user, {
        displayName: userData.username,
      });

      // Admin huquqini tekshirish
      const isAdminUser = email === "microsoftreact@gmail.com";

      // Firestore'da foydalanuvchi ma'lumotlarini saqlash
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        createdAt: new Date().toISOString(),
        isAdmin: isAdminUser, // Avtomatik admin huquqi
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Email/parol bilan kirish
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Foydalanuvchi profilini olish
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);

        // Admin bo'lsa, admin panelga yo'naltirish
        if (userData.isAdmin && email === "microsoftreact@gmail.com") {
          // Admin panelga yo'naltirish logikasi bu yerda bo'ladi
          console.log("Admin kirdi - Admin panelga yo'naltiriladi");
        } else {
          // Oddiy user - test selection ga yo'naltirish
          console.log("Oddiy user kirdi - Test selection ga yo'naltiriladi");
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Google orqali kirish
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Foydalanuvchi mavjud emas bo'lsa, yangi profil yaratish
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        // Admin huquqini tekshirish
        const isAdminUser = result.user.email === "microsoftreact@gmail.com";

        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName || result.user.email.split("@")[0],
          firstName: result.user.displayName?.split(" ")[0] || "",
          lastName:
            result.user.displayName?.split(" ").slice(1).join(" ") || "",
          age: null,
          createdAt: new Date().toISOString(),
          isAdmin: isAdminUser, // Avtomatik admin huquqi
          provider: "google",
        });

        // Yangi foydalanuvchi uchun yo'nalish
        if (isAdminUser) {
          console.log("Yangi admin kirdi - Admin panelga yo'naltiriladi");
        } else {
          console.log(
            "Yangi oddiy user kirdi - Test selection ga yo'naltiriladi"
          );
        }
      } else {
        const userData = userDoc.data();
        setUserProfile(userData);

        // Mavjud foydalanuvchi uchun yo'nalish
        if (
          userData.isAdmin &&
          result.user.email === "microsoftreact@gmail.com"
        ) {
          console.log("Mavjud admin kirdi - Admin panelga yo'naltiriladi");
        } else {
          console.log(
            "Mavjud oddiy user kirdi - Test selection ga yo'naltiriladi"
          );
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // GitHub orqali kirish
  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        // Admin huquqini tekshirish
        const isAdminUser = result.user.email === "microsoftreact@gmail.com";

        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName || result.user.email.split("@")[0],
          firstName: result.user.displayName?.split(" ")[0] || "",
          lastName:
            result.user.displayName?.split(" ").slice(1).join(" ") || "",
          age: null,
          createdAt: new Date().toISOString(),
          isAdmin: isAdminUser, // Avtomatik admin huquqi
          provider: "github",
        });

        // Yangi foydalanuvchi uchun yo'nalish
        if (isAdminUser) {
          console.log("Yangi admin kirdi - Admin panelga yo'naltiriladi");
        } else {
          console.log(
            "Yangi oddiy user kirdi - Test selection ga yo'naltiriladi"
          );
        }
      } else {
        const userData = userDoc.data();
        setUserProfile(userData);

        // Mavjud foydalanuvchi uchun yo'nalish
        if (
          userData.isAdmin &&
          result.user.email === "microsoftreact@gmail.com"
        ) {
          console.log("Mavjud admin kirdi - Admin panelga yo'naltiriladi");
        } else {
          console.log(
            "Mavjud oddiy user kirdi - Test selection ga yo'naltiriladi"
          );
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Chiqish
  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  // Admin tekshirish (faqat sizning email'ingiz admin bo'lishi mumkin)
  const isAdmin = () => {
    if (!currentUser) return false;

    // Email bo'yicha admin tekshirish (userProfile yuklanmaguncha ham)
    if (currentUser.email === "microsoftreact@gmail.com") {
      // userProfile mavjud bo'lsa, isAdmin flag'ini ham tekshirish
      if (userProfile) {
        return userProfile.isAdmin === true;
      }
      // userProfile yuklanmagan bo'lsa, email bo'yicha admin deb hisoblash
      return true;
    }

    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Foydalanuvchi profilini olish
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
