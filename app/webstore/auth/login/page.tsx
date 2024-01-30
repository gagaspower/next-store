"use client";
import TextInput from "@/components/application-ui/form/TextInput";
import withWebStore from "@/context/withWebStore";
import { IAuthLogin } from "@/interface/auth";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const StoreLogin = () => {
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
      console.log(values);
    },
  });
  return (
    <section className="w-full md:max-w-6xl m-auto  mt-5 mb-5 bg-white p-5 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mx-auto">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={formik.handleSubmit}
          >
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
`}
            >
              <span className="text-sm text-white">Login</span>
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
          </form>
        </div>
      </div>
    </section>
  );
};

export default withWebStore(StoreLogin);
