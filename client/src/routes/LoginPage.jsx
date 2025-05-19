import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-50px)]">
      {/* Clerk'i sisse logimise komponent, suunab registreerimisel "/register" lehele */}
      <SignIn signUpUrl="/register"/>
    </div>
  );
};

export default LoginPage;