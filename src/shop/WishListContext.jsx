import React, { createContext, useContext, useState } from 'react';
import { userAPI } from '../services/api';
import UserContext from './UserContext';
import {jwtDecode} from 'jwt-decode';

const WishListContext = createContext();

export function WishListProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchProfile, userToken } = useContext(UserContext);


    const addToWishlist = async (productId) => {
        try {
            setLoading(true);
            const res = await userAPI.addToWishlist(productId);
            fetchWishlist();
            fetchProfile();
            console.log(res);
           
        } catch (error) {
            console.error('Error adding in wishlist:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeItemFromWishlist = async (productId) => {
            try {
                setLoading(true);
                const res = await userAPI.removeFromWishlist(productId);
                fetchWishlist();
                fetchProfile();
                console.log(res);            
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                throw error;
            } finally {
                setLoading(false);
            }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.find(item => item._id === productId);
    };

    // Fetch user's wishlist
    const fetchWishlist = async (id) => {
        try {
            setLoading(true);
            const response = await userAPI.getWishlist(id);
            console.log('wish', response);
            
            if (response.data && response.data.whishList) {
                const items = response.data.whishList.whishList || response.data.whishList || [];
                fetchProfile();
                setWishlistItems(items);
            } else {
                setWishlistItems([]);
            }
            
            return response.data;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setWishlistItems([]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        wishlistItems,
        loading,
        addToWishlist,
        removeItemFromWishlist,
        isInWishlist,
        fetchWishlist
    };

    return (
        <WishListContext.Provider value={value}>
            {children}
        </WishListContext.Provider>
    );
}

export function useWishList() {
    const context = useContext(WishListContext);
    if (!context) {
        throw new Error('useWishList must be used within a WishListProvider');
    }
    return context;
}

export default WishListContext;