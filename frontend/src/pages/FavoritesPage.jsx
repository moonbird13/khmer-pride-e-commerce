import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addFavorite, getFavorites, removeFavorite } from '../services/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './favoritesPage.css';

export default function FavoritesPage() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        loadFavorites();
    }, [user]);

    const loadFavorites = async () => {
        setLoading(true);

        try {
            const data = await getFavorites();
            setFavorites(data);
            setFavoriteIds(new Set(data.map((product) => String(product.id))));
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (product) => {
        if (!product?.id) return;

        const productId = String(product.id);
        const isFavorited = favoriteIds.has(productId);

        try {
            if (isFavorited) {
                await removeFavorite(product.id);
                setFavorites((current) => current.filter((item) => String(item.id) !== productId));
                setFavoriteIds((current) => {
                    const next = new Set(current);
                    next.delete(productId);
                    return next;
                });
            } else {
                await addFavorite(product.id);
                setFavorites((current) => [...current, product]);
                setFavoriteIds((current) => {
                    const next = new Set(current);
                    next.add(productId);
                    return next;
                });
            }
        } catch (error) {
            console.error('Failed to update favorites:', error);
        }
    };

    const favoritesCount = favorites.length;

    const favoriteGrid = useMemo(
        () => (
            <div className="favorite-grid">
                {favorites.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={favoriteIds.has(String(product.id))}
                    />
                ))}
            </div>
        ),
        [favorites, favoriteIds]
    );

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
                    {favoriteGrid}
                </div>
            )}
        </div>
    );
}