import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function FavoritesPage() {
  const { user } = useAuth();

  return (
    <div className="protected-page">
      <h2>
        <Heart
          size={24}
          style={{
            verticalAlign: "middle",
            marginRight: 10,
            color: "var(--color-save-active)",
          }}
        />
        Your Favorites
      </h2>
      <p>
        Welcome, {user?.email}. Your saved recipes will appear here once the
        favorites feature is connected to the backend.
      </p>
    </div>
  );
}

