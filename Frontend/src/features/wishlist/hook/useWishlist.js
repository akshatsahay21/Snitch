import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlistApi, toggleWishlistItemApi } from '../service/wishlist.api.js';
import { setWishlist, toggleWishlistItem as toggleReduxWishlist } from '../../account/state/account.slice.js';

export const useWishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.account.wishlist);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetWishlist = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getWishlistApi();
            if (data.success) {
                dispatch(setWishlist(data.wishlist));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to get wishlist");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleWishlistItem = async (productId) => {
        try {
            const data = await toggleWishlistItemApi(productId);
            if (data.success) {
                dispatch(setWishlist(data.wishlist));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to toggle wishlist item");
        }
    };

    return {
        wishlist,
        loading,
        error,
        handleGetWishlist,
        handleToggleWishlistItem
    };
};
