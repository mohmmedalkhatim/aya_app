import { useState } from "react"
import { Heading } from "../../../components/heading"
import Input from "../../../components/Input"
import { fetch } from "@tauri-apps/plugin-http"
import { Link } from "react-router-dom"

interface RegisterPayload {
    name: string
    email: string
    password: string
    confirm_password: string
}

function SignUp() {
    const [form, setForm] = useState<RegisterPayload>({
        name: "",
        email: "",
        password: "",
        confirm_password:""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleChange = (key: keyof RegisterPayload, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setError(null)
        setSuccess(null)

        if (!form.name || !form.email || !form.password) {
            setError("All fields are required.")
            return
        }
        if (form.confirm_password == form.password) {
            setError("")
            return
        }

        try {
            setLoading(true)

            const response = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            console.log(response)
            if (!response.ok) {
                const message = await response.text()
                throw new Error(message || "Registration failed")
            }

            const data = await response.json()
            setSuccess("Account created successfully.")
            console.log("Server response:", data)

        } catch (err: any) {
            setError(err.message || "Unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="content pt-40 flex flex-col justify-center h-[30rem]">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col px-4 gap-6 w-full"
            >
                <center className="flex-col">
                    <img height={140} width={140} src="/aya_app_icon.png" />
                </center>

                <Input
                    required
                    label="Name"
                    placeholder="Tell us your name"
                    value={form.name}
                    onChange={(e: any) => handleChange("name", e.target.value)}
                />

                <Input
                    required
                    label="Email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e: any) => handleChange("email", e.target.value)}
                />

                <Input
                    required
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={form.password}
                    onChange={(e: any) => handleChange("password", e.target.value)}
                />
                <Input
                    required
                    label="Confirm_password"
                    placeholder="Confirm your password"
                    type="password"
                    value={form.password}
                    onChange={(e: any) => handleChange("confirm_password", e.target.value)}
                />


                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white py-2 rounded"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>
                <div className="flex gap-1">
                    <div>
                        do you already have and account?
                    </div>
                    <Link className="text-sky-500 underline" to={"/sign_in"}>
                        login
                    </Link>
                </div>
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                {success && (
                    <p className="text-green-600 text-sm">{success}</p>
                )}
            </form>
        </main>
    )
}

export default SignUp