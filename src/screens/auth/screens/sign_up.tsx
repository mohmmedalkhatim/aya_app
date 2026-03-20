import { useState } from "react"
import { Heading } from "../../../components/heading"
import Input from "../../../components/Input"
import { fetch } from "@tauri-apps/plugin-http"
import { Link, useNavigate } from "react-router-dom"
import { storage } from "../../../main"
import { useStore } from "../../../context"
import { invoke } from "@tauri-apps/api/core"
import { IconBrandGoogle } from "@tabler/icons-react"

interface RegisterPayload {
    name: string
    email: string
    password: string
    confirm_password: string
}

function SignUp() {
    let nevigate = useNavigate()
    const [form, setForm] = useState<RegisterPayload>({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const setInfo = useStore(state => state.setInfo)

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
        console.log(form)
        if (form.confirm_password !== form.password) {
            setError("the passwords doesn't match")
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
            setInfo(data)
            storage.set("keys", data)
            nevigate("/")
            setSuccess("Account created successfully.")
            console.log("Server response:", data)

        } catch (err: any) {
            setError(err.message || "Unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="content pt-70 flex flex-col justify-center h-120">
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
                    value={form.confirm_password}
                    onChange={(e: any) => handleChange("confirm_password", e.target.value)}
                />


                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#222b3c] text-white py-2 rounded"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>
                <button
                    onClick={() => invoke("start_oauth_server")}
                    className="bg-[#222b3c] text-white py-2 rounded"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div>register with Google </div><IconBrandGoogle />
                    </div>
                </button>
                <div className="flex gap-1">
                    <div>
                        do you already have and account?
                    </div>
                    <Link viewTransition className="text-sky-500 underline" to={"/sign_in"}>
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