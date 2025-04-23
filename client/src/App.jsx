// loodud backend testimise eesmärgil, et kontrollida, kas Clerk töötab ja kas andmebaasiga on ühendatud
// käsk rakenduse käivitamiseks - npm run dev

import { useState } from "react"; // React Hooki importimine
import { SignIn, SignUp, UserButton, useUser } from "@clerk/clerk-react"; // Clerk'i autentimisvahendid

function App() {
  const { isSignedIn } = useUser(); // Kasutaja sisselogimise oleku kontrollimine
  const [token, setToken] = useState(""); // Seisundi hoidmine, et salvestada saamine token
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Lüliti, et vahetada sisselogimise ja registreerimise vahel

  // Funktsioon tokeni hankimiseks pärast sisselogimist
  const handleGetToken = async () => {
    if (!isSignedIn) return; // Kui kasutaja pole sisse logitud, ei toimu midagi

    try {
      // Hangime pikaajaline JWT token Clerkist
      const jwt = await window.Clerk.session.getToken({ template: "long-lived" });
      setToken(jwt); // Seadistame token olekusse
    } catch (error) {
      console.error("Ошибка получения токена:", error); // Kui viga, prindime veateate
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isSignedIn ? ( // Kui kasutaja on sisse logitud
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Вы вошли в систему</h1>
          <UserButton afterSignOutUrl="/" /> {/* Nupp sisse logimise järgselt väljalogimiseks */}

          <button
            onClick={handleGetToken}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Получить токен
          </button>

          {token && (
            <div className="mt-4">
              <input
                type="text"
                value={token}
                readOnly
                className="w-full p-2 border rounded text-black"
              />
            </div>
          )}
        </div>
      ) : (
        // Kui kasutaja ei ole sisse logitud, kuvatakse sisselogimise või registreerimise vorm
        <div className="text-center">
          {isSignUpMode ? <SignUp /> : <SignIn />} {/* Kui signUpMode on aktiivne, siis kuvatakse registreerimisvorm, vastasel juhul logimise vorm */}

          <button
            onClick={() => setIsSignUpMode((prev) => !prev)} // Lülitame registreerimise ja logimise vahel
            className="mt-4 text-blue-600 underline"
          >
            {isSignUpMode
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрироваться"} {/* Lülitusnupp, mis muutub sõltuvalt olekust */}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;