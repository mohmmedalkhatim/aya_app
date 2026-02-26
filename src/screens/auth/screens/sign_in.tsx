import { useState } from "react"
import { Heading } from "../../../components/heading"
import Input from "../../../components/Input"
import { fetch } from "@tauri-apps/plugin-http"
import { Link } from "react-router-dom"
import { useStore } from "../../../context"
import { storage } from "../../../main"

interface LoginPassword {
    email: string
    password: string
}

function SignUp() {
    const [form, setForm] = useState<LoginPassword>({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const setInfo = useStore(state=>state.setInfo)

    const handleChange = (key: keyof LoginPassword, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setError(null)
        setSuccess(null)

        if (!form.email || !form.password) {
            setError("All fields are required.")
            return
        }

        try {
            setLoading(true)

            const response = await fetch("http://localhost:4000/auth/login", {
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
            setInfo(data)
            storage.set("info",data)
            setSuccess("login successfully.")

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
                    label="Email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e: any) => handleChange("email", e.target.value)}
                />

                <Input
                    required
                    label="Password"
                    placeholder="password"
                    type="password"
                    value={form.password}
                    onChange={(e: any) => handleChange("password", e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#222b3c] text-white py-2 rounded"
                >
                    {loading ? "Creating..." : "Login"}
                </button>
                <div className="flex gap-1">
                    <div>
                        don't an account?
                    </div>
                    <Link className="text-sky-500 underline" to={"/"}>
                        register
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