import { useContext, useEffect } from "react";
import { AuthContext } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

export default function withAuth(Component) {
  return function AuthComponent(props) {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/login");
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
      return null;
    }

    return <Component {...props} />;
  };
}
