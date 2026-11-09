import { SlidersHorizontal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function PreferencesPage() {
  const { user } = useAuth();

  return (
    <div className="protected-page">
      <h2>
        <SlidersHorizontal
          size={24}
          style={{
            verticalAlign: "middle",
            marginRight: 10,
            color: "var(--accent)",
          }}
        />
        Preferences
      </h2>
      <p>
        Hi, {user?.email}. Dietary preferences, cuisine filters, and
        notification settings will be available here soon.
      </p>
    </div>
  );
}

