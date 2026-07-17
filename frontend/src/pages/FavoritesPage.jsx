import { useEffect, useState } from "react";
import { getFavorites } from "../services/api";
import ProductCard from "../components/ProductCard/ProductCard";
import "./FavoritesPage.css";

export default function FavoritesPage(){
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch(error) {
            console.error("Error loading favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="favorites-page"><p>Loading...</p></div>;
    }

    return (
        <div className="favorites-page">
            <section className="favorites-hero">
                <h1>Your Favorite Collection</h1>
            </section>

            {favorites.length === 0 ? (
                <div className="empty-favorite">
                    <p>You don't have favorite products yet.</p>
                    <a href="/products" className="btn">Continue Shopping</a>
                </div>
            ) : (
                <div className="favorite-container">
                    <h2>Saved Products ({favorites.length})</h2>
                    <div className="favorite-grid">
                        {favorites.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}