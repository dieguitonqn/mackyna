import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { validateTurnstileToken } from "next-turnstile";
import { v4 } from "uuid";

const acceptedResponse = () =>
    NextResponse.json(
        { message: "Si los datos permiten crear la solicitud, quedará pendiente de aprobación." },
        { status: 202 }
    );

const isDuplicateEmailError = (error: unknown): boolean =>
    typeof error === "object" && error !== null && "code" in error && error.code === 11000;

export const POST = async (req: Request) => {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const nombre = typeof input.nombre === "string" ? input.nombre.trim() : "";
    const apellido = typeof input.apellido === "string" ? input.apellido.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const pwd = typeof input.pwd === "string" ? input.pwd : "";
    const token = typeof input.token === "string" ? input.token.trim() : "";

    if (
        nombre.length === 0 || nombre.length > 100 ||
        apellido.length === 0 || apellido.length > 100 ||
        email.length === 0 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        pwd.length === 0 || pwd.length > 1024 ||
        token.length === 0 || token.length > 4096
    ) {
        return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
        return NextResponse.json({ message: "No se pudo procesar la solicitud." }, { status: 503 });
    }

    try {
        const validationResponse = await validateTurnstileToken({
            token,
            secretKey,
            idempotencyKey: v4(),
        });

        if (!validationResponse.success) {
            return NextResponse.json({ message: "No pudimos validar la solicitud." }, { status: 400 });
        }

        await connect();

        const hashedPassword = await argon2.hash(pwd);
        const newUser = new User({
            nombre,
            apellido,
            email,
            pwd: hashedPassword,
            rol: "user",
            habilitado: false,
            bloqueado: false,
        });

        try {
            await newUser.save();
        } catch (error: unknown) {
            if (isDuplicateEmailError(error)) {
                return acceptedResponse();
            }
            throw error;
        }

        return acceptedResponse();
    } catch {
        return NextResponse.json({ message: "No se pudo procesar la solicitud." }, { status: 500 });
    }
};
