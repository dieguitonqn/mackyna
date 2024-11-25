import React from "react"
import Image from "next/image"
import { SignUpForm } from "@/components/signupForm"

export default function SignUp() {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <div className="flex flex-col bg-slate-400 rounded p-10  justify-center items-center gap-10">
                <Image
                    src={"/mackyna.png"}
                    alt="Logo de mackyna"
                    width={150}
                    height={150}
                />
                <SignUpForm />
            </div>


        </div>
    )
}