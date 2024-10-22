"use client";

import { newVerification } from "@/actions/new-verification";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-seccess";
import { CardWrapper } from "./card-wrapper";

const VerificationFormContent = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
        }

        newVerification(token!)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CardWrapper
                headerLabel="Confirming you verification"
                backButtonLabel="Back to login"
                backButtonHref="/auth/login"
            >
                <div className="flex items-center w-full justify-center">
                    {!success && !error && <BeatLoader />}
                    {!success && <FormError message={error} />}
                    <FormSuccess message={success} />
                </div>
            </CardWrapper>
        </Suspense>
    );
};

export const NewVerificationForm = () => (
    <Suspense fallback={<BeatLoader />}>
        <VerificationFormContent />
    </Suspense>
);
