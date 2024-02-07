import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useSessionContext } from "./sessionProvider";

interface WithAuthProps {
  roles: string[]; // Tambahkan properti roles
}

const withAuth = (Component: FC<any>, { roles }: WithAuthProps) => {
  const Authenticated: FC = (props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { sessionAuth } = useSessionContext();
    const { token } = sessionAuth;
    const userRoles = sessionAuth?.session_id?.roles || "";
    const hasPermission = roles.includes(userRoles);
    useEffect(() => {
      if (!token) {
        router.replace("/auth");
      } else {
        // akses by roles
        if (userRoles === "admin" && pathname === "/dashboard") {
          router.push("/dashboard");
        } else if (userRoles === "user" && pathname === "/account") {
          router.push("/account");
        }
      }
    }, [token, router, pathname, userRoles]);

    // if (!hasPermission) {
    //   // Tampilkan null atau komponen lain jika tidak memiliki izin
    //   router.push("/auth");
    // }

    return <Component {...props} />;
  };

  return Authenticated;
};

export default withAuth;
