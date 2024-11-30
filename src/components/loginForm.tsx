'use client'
import { signIn } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";




export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password);
        // Log both email and password
        // Replace this with your actual sign-in logic using `signIn`
        signIn('credentials',
            {
                redirect: true,
                email,
                password,
                callbackUrl: '/' // Adjust callback URL as needed
            }
        );
    };




    return (
        <div className="flex h-screen w-screen justify-center items-center">


            <div className="flex flex-col justify-start p-4 w-full md:w-1/2 xl:w-1/3  border-2 border-slate-950 bg-slate-300 rounded-lg items-center">
                <Image
                    src={"/mackyna.png"}
                    alt="Logo mackyna"
                    width={163}
                    height={111}
                />
                <form onSubmit={handleSubmit} className="flex flex-col justify-start p-2 mt-10">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        className="border border-slate-500 p-2 mb-5"
                        onChange={
                            (e) => { setEmail(e.target.value) }}
                        required
                    />
                    <label htmlFor="pass">Password:</label>
                    <input
                        type="password"
                        name=""
                        id="pass"
                        className="border border-slate-500 p-2 mb-5"
                        onChange={
                            (e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        // onClick={() => signIn("credentials")}
                        className="bg-emerald-600 px-4 py-2 rounded-sm w-auto m-auto text-white font-semibold">
                        Iniciar sesión
                    </button>
                </form>
                <p className="text-center">ó</p>
                <button
                    onClick={() => signIn("google", { callbackUrl: '/' })}
                    className="p-2 rounded-lg w-1/4 items-center justify-center border bg-white border-slate-200 m-auto mt-5 ">

                    <FcGoogle className="m-auto h-9 w-9" />

                </button>
                <span className="flex justify-center mt-2">¿Aún no tenés cuenta? <Link href={"/signUp"} className=" mx-2 underline text-emerald-700 hover:font-semibold" >Resgistrate AQUI</Link></span>
            </div>
        </div>
    )
}