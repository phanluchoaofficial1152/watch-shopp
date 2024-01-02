"use client";

import React, {useEffect, useState} from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import {AiOutlineGoogle} from "react-icons/ai";
import {signIn} from "next-auth/react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {SafeUser} from "@/types";

interface LoginFormProps {
    currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push('/cart');
            router.refresh();
        }
    }, []);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                router.push("/cart");
                router.refresh();
                toast.success("Logged in!");
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        });
    };

    if (currentUser) {
        return <p className="text-center font-semibold">Logged In! Redirecting....</p>;
    }

    return (
        <>
            <Heading title="Sign in"/>
            <Button
                outline
                label="Continue with Google"
                icon={AiOutlineGoogle}
                onClick={() => {
                    signIn('google');
                }}
            />
            <hr className="bg-slate-300 w-full h-px"/>
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="password"
            />
            <Button
                label={isLoading ? "Loading" : "Sign In"}
                onClick={handleSubmit(onSubmit)}
            />
            <p className="text-sm">
                Don't have an account?{" "}
                <Link className="underline" href="/register">
                    Sign Up
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
