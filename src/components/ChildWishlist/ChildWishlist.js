import React,{ useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiContants';
import axios from 'axios'
import Wishlist from '../Wishlist/Wishlist';

function ChildWishlist(props) {
    const [currentUserId , setCurrentUserId] = useState(undefined);
    const [childWishlists , setChildWishlists] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(ACCESS_TOKEN_NAME)) {
            setCurrentUserId(parseInt(localStorage.getItem(ACCESS_TOKEN_NAME)));
        } else {
            redirectToLogin();
        }

        getChildWishlists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function redirectToLogin() {
        props.history.push('/');
    }

    const getChildWishlists = async () => {
        return await axios.get(API_BASE_URL + "/636eba4965b57a31e6b4cdc9/latest")
            .then(function (response) {
                setChildWishlists(response.data.record);
                setIsSaving(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const addItem = async (childId, text) => {
        setIsSaving(childId);

        const oldData = [...childWishlists];
        const filtered = [...oldData].filter(x => x.id === childId);
        const newId = [...filtered[0].wishlist].length > 0 ? Math.max(...filtered[0].wishlist.map(p => p.id)) : 0;

        const newItem = {
            "id": newId + 1,
            "text": text,
            "owner": null
        };

        const updated = oldData.map(p =>
            p.id === childId
            ?  { ...p, wishlist: [...p.wishlist, newItem]}
            : p
        );

        updateWishlist(updated);
    }

    const removeItem = async (childId, itemId) => {
        setIsSaving([childId, itemId]);

        const oldData = [...childWishlists];
        const updated = oldData.map(p =>
            p.id === childId
            ?  { ...p, wishlist: [...p.wishlist.filter(x => x.id !== itemId)]}
            : p
        );

        updateWishlist(updated);
    }

    const toggleItemOwner = (childId, itemId) => {
        setIsSaving([childId, itemId]);

        const oldData = [...childWishlists];
        const updated = oldData.map(p =>
            p.id === childId
            ?  { ...p, wishlist: [...p.wishlist].map(x =>
                    x.id === itemId
                    ?  { ...x, owner: x.owner === currentUserId ? null : currentUserId}
                    : x)
                }
            : p
        );

        updateWishlist(updated);
    }

    const updateWishlist = (updated) => {
        axios.put(API_BASE_URL + "/636eba4965b57a31e6b4cdc9 ", updated)
            .then(function (response) {
                getChildWishlists();
            })
            .catch(function (error) {
                setIsSaving(false);
            });
    }

    return(
        <>
            <div className="card col-md-6 col-sm-12 mt-4 p-3">
                {currentUserId !== undefined && (
                    <div className="row">
                        <div className="col-12">
                            {childWishlists &&  childWishlists.map(child =>
                                <Wishlist
                                    key={child.id}
                                    child={child}
                                    ownerId={currentUserId}
                                    onUpdateWishlistItem={(childId, itemId) => toggleItemOwner(childId, itemId)}
                                    onAddItem={(childId, text) => addItem(childId, text)}
                                    onRemoveItem={(childId, itemId) => removeItem(childId, itemId)}
                                    isSaving={isSaving}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default withRouter(ChildWishlist);