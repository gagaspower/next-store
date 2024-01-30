"use client";
import React, { useEffect, useState } from "react";
import { IAuthLogin } from "@/interface/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextInput from "@/components/application-ui/form/TextInput";

import { useRouter } from "next/navigation";
import { publicApi } from "@/utils/httpClient";

import withAuth from "@/context/withAuth";
import { useSessionContext } from "@/context/sessionProvider";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

const LoginAuth = () => {
  const router = useRouter();

  const { sessionAuth, setSessionAuth } = useSessionContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { roles } = sessionAuth.session_id;
  const { token } = sessionAuth;

  const initialValue: IAuthLogin = {
    email: "",
    password: "",
  };

  const schema = Yup.object({
    email: Yup.string()
      .email("Email tidak benar")
      .required("Email wajib diisi"),
    password: Yup.string().test({
      name: "is-password",
      test(value, ctx) {
        if (!value) {
          return ctx.createError({ message: "Password wajib diisi" });
        }
        if (value.length < 6) {
          return ctx.createError({
            message: "Password terlalu pendek",
          });
        }
        if (value.length > 8) {
          return ctx.createError({
            message: "Password terlalu panjang",
          });
        }
        if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
          return ctx.createError({
            message: "Password tidak diizinkan",
          });
        }
        return true;
      },
    }),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    onSubmit: async (values) => {
      const { email, password } = values;
      await signIn({ email, password });
    },
  });

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await publicApi.post(`/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("auth", JSON.stringify(response?.data?.data));
      setSessionAuth(response?.data?.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw error.message;
    }
  };

  useEffect(() => {
    if (token) {
      if (roles === "admin") {
        router.push("/dashboard");
      } else if (roles === "user") {
        router.push("/account");
      }
    }
  }, [token, router, roles]);

  const Spinner = () => {
    return (
      <span className="relative only:-mx-5">
        <svg
          className="w-5 h-5 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="graphics-symbol"
          aria-labelledby="title-10 desc-10"
        >
          <title id="title-10">Icon title</title>
          <desc id="desc-10">A more detailed description of the icon</desc>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <TextInput
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.email}
            />
          </div>
          <div>
            <TextInput
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              maxWidth="lg"
              error={formik.errors.password}
            />
          </div>

          <button
            type="submit"
            className={`flex items-center justify-center w-full gap-2 rounded-md p-2 bg-blue-500 hover:bg-blue-700
             ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"}`}
            disabled={loading ? true : false}
          >
            <span className="text-sm text-white">Login</span>
            {loading ? <Spinner /> : null}
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Belum punya akun?{" "}
            <a
              href="#"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Daftar
            </a>
          </p>
          <p>
            <Link
              href="/"
              className="flex items-center text-sm font-light text-gray-500 dark:text-gray-400 gap-3"
            >
              <BsArrowLeft /> Kembali ke toko{" "}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default withAuth(LoginAuth, { roles: ["admin", "user"] });
