import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

    const session = await auth();

    if (!session) {
        // redirect('/auth/login?returnTo=/perfil');
        redirect('/');
    }

    return (
        <div>
            <Title title="Perfil" />

            <pre>
                {
                    JSON.stringify(session.user, null, 2)
                }

            </pre>
            <h3 className="text-5xl mb-10">
                {session.user.role}
            </h3>
        </div>
    );
}