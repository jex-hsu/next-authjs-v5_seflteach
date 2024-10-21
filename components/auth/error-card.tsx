import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive" />
            </div>
        </CardWrapper>
        // <Card className="w-[400px] shadow-md">
        //     <CardHeader>
        //         <Header label="Oops! Something went wrong!" />
        //     </CardHeader>
        //     <CardFooter>
        //         <BackButton
        //             label="Back to login"
        //             href="/auth/login"
        //         ></BackButton>
        //     </CardFooter>
        // </Card>
    );
};
