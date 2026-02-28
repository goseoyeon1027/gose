import { createContext, useContext, useState, ReactNode } from "react";

export interface FavoriteItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
}

interface FavoritesContextType {
  favoriteItems: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavoriteItems((prev) => {
      // 이미 즐겨찾기에 있는지 확인
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: number) => {
    return favoriteItems.some((item) => item.id === id);
  };

  const favoritesCount = favoriteItems.length;

  return (
    <FavoritesContext.Provider
      value={{ favoriteItems, addToFavorites, removeFromFavorites, isFavorite, favoritesCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

