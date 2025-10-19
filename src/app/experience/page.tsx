import React, { useState }  from "react";
import { sendContactMail } from "./actions";

type FormState = {
    name: string;
    email: string;
    message: string;
}

export default function Home() {
    const [form, setForm] = useState<FormState>{{ name: "", email: "", message: ""}};
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleChange = async (e : React.FormEvent<HTMLInputElement |HTMLTextAreaElement>) => 
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault;
        setStatus("sending");
        setErrorMsg(null);

        // FormData uit het formulier - dit wordt rechtstreeks naar de server action gestuurd.
        const fd = new FormData(e.currentTarget);

        try {
            const result = await sendContactMail(fd)
            if (result.success) {
                setStatus("success");
                setForm({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
                setErrorMsg(result.error ?? "Onbekende fout");
            }
        } catch (err) {
            console.error("Client error:", err);
            setStatus("error");
            setErrorMsg("Kon geen verbinding maken met de server.");
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Contacteer ons.</h1>

            {status === "success" && (
                <p className="bg-green-100 border border-green-400 text-green 700 p-3 rounded mb-4">
                    Je bericht is verzonden!
                </p>
            )}

            {status === "error" && (
                <p className="bg-red-100 border border-red-400 text-red 700 p-3 rounded mb-4">
                    {errorMsg}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Naam</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>

                <div>
                    <label className="block text-sm font-medium">E-mail</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>

                <div>
                    <label className="block text-sm font-medium">Naam</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="w-full border rounded p-2" required />
                </div>

                <button type="submit" disabled={status === "sending"} className="bg-blue-600 text-white px-4 py-2 rounded hover: bg-blue-700">
                    {status === "sending" ? "verzenden..." : "Versturen"}
                </button>
            </form>
        </div>
    )
};

