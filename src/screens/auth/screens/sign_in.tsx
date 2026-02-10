import { Heading } from "../../../components/heading"
import Input from "../../../components/Input"

function SignIn() {
    return (
        <main className="content pt-24 flex flex-col justify-center h-[30rem]">
            <div className="flex flex-col px-8 gap-6 w-full">
                <center>
                    <Heading level={1} size="2xl" weight="semibold">
                        Sign In
                    </Heading>
                </center>
                <Input label="Email" placeholder="Enter your email" />
                <Input label="Password" placeholder="Enter your password" type="password" />
            </div>
        </main>
    )
}
export default SignIn