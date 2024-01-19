import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useSessionContext } from "../context/sessionProvider";

const withAuth = (Component: any) => {
  const Authenticated: FC = (props) => {
    const router = useRouter();
    const { sessionAuth } = useSessionContext();
    const { token } = sessionAuth;

    useEffect(() => {
      if (!token) {
        // Redirect to home page or login page if not admin
        router.push("/auth");
      }
      // router.push("/dashboard");
    }, [token, router]);

    return <Component {...props} />;
  };

  return Authenticated;
};

export default withAuth;
