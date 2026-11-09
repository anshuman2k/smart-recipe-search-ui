import { User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="protected-page">
      <h2>
        <User
          size={24}
          style={{
            verticalAlign: "middle",
            marginRight: 10,
            color: "var(--accent)",
          }}
        />
        Your Profile
      </h2>
      <p>
        Signed in as <strong>{user?.email}</strong>.
      </p>
      <p>
        Profile customization options will be available here in a future update.
      </p>
    </div>
  );
}

