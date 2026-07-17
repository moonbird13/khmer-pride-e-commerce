import { useState, useEffect } from "react";

export default function FavoritesPage() {

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {

        // Load favorites here

    }, []);

    return (

        <div className="container">

            <h1>My Favorites</h1>

        </div>

    );

}