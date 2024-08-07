import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { firestore, auth } from '../database/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export const CategoryRecipeDetail = ({ route, navigation }) => {
    const { recipeId, onFavoriteChange } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [newComment, setNewComment] = useState('');
    const currentUser = auth.currentUser;
    const flatListRef = useRef(null);
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeRef = doc(firestore, 'recipes', recipeId);
                const recipeSnap = await getDoc(recipeRef);
                if (recipeSnap.exists()) {
                    const recipeData = recipeSnap.data();
                    setRecipe(recipeData);
                    setLikeCount(recipeData.likes || 0);
                    setIsLiked(recipeData.likedBy && recipeData.likedBy.includes(currentUser.uid));
                } else {
                    console.log('No such document!');
                    Alert.alert('Error', 'Recipe not found');
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
                Alert.alert('Error', 'Failed to load recipe details');
            }
        };

        fetchRecipe();
    }, [recipeId, currentUser.uid]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleLike = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'You must be logged in to like a recipe');
            return;
        }

        try {
            const recipeRef = doc(firestore, 'recipes', recipeId);

            if (isLiked) {
                await updateDoc(recipeRef, {
                    likedBy: arrayRemove(currentUser.uid),
                    likes: increment(-1)
                });
                console.log('Like removed');
            } else {
                await updateDoc(recipeRef, {
                    likedBy: arrayUnion(currentUser.uid),
                    likes: increment(1)
                });
                console.log('Like added');
            }

            const updatedRecipeSnap = await getDoc(recipeRef);
            if (updatedRecipeSnap.exists()) {
                const updatedRecipeData = updatedRecipeSnap.data();
                setRecipe(updatedRecipeData);
                const newLikeCount = Math.max(updatedRecipeData.likes || 0, 0);
                setLikeCount(newLikeCount);
                const newIsLiked = updatedRecipeData.likedBy && updatedRecipeData.likedBy.includes(currentUser.uid);
                setIsLiked(newIsLiked);

                // Call onFavoriteChange with the updated like status
                onFavoriteChange && onFavoriteChange(recipeId, newIsLiked);

                console.log('Updated recipe data:', updatedRecipeData);
            }
        } catch (error) {
            console.error('Error updating like:', error);
            Alert.alert('Error', 'Failed to update like status');
        }
    };

    const handleAddComment = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'You must be logged in to comment');
            return;
        }

        if (!newComment.trim()) {
            Alert.alert('Error', 'Comment cannot be empty');
            return;
        }

        try {
            const recipeRef = doc(firestore, 'recipes', recipeId);
            const comment = {
                userId: currentUser.uid,
                username: currentUser.displayName || 'Anonymous',
                text: newComment,
                timestamp: new Date().toISOString(),
            };

            await updateDoc(recipeRef, {
                comments: arrayUnion(comment)
            });

            setRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: [...(prevRecipe.comments || []), comment]
            }));
            setNewComment('');

            // Scroll to the bottom of the list
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment');
        }
    };

    if (!recipe) {
        return <Text>Loading...</Text>;
    }

    const renderRecipeDetails = () => (
        <View>
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
            <Text style={styles.userName}>By: {recipe.userName}</Text>
            <View style={styles.containerRow}>
                <TouchableOpacity onPress={handleLike} style={styles.likeContainer}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={20}
                        color={isLiked ? "red" : "black"}
                    />
                    <Text style={styles.likeCount}>{likeCount}</Text>
                </TouchableOpacity>
                <Text>{recipe.cookingTime || '25 minutes'}</Text>
                <View style={styles.commentCountContainer}>
                    <Ionicons name="people" size={20} color="black" />
                    <Text style={styles.commentCount}>{recipe.comments ? recipe.comments.length : 0}</Text>
                </View>
            </View>
            <View style={styles.descriptionContainer}>
            <Text style={styles.ingredientsTitle}>Serves:</Text>
                <Text style={styles.ingredients}>{recipe.serves}</Text>
                <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                <Text style={styles.ingredients}>{recipe.ingredients}</Text>
                <Text style={styles.directionsTitle}>Directions:</Text>
                <Text style={styles.directions}>{recipe.description}</Text>
                <Text style={styles.commentsTitle}>Comments:</Text>
            </View>
        </View>
    );

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Ionicons name="person-circle-outline" size={30} color="grey" style={styles.commentIcon} />
            </View>
            <View>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
        >
            <FlatList
                ref={flatListRef}
                style={styles.flatList}
                ListHeaderComponent={
                    <View>
                        {renderRecipeDetails()}
                        <View style={styles.addCommentContainer}>
                            <TextInput
                                style={styles.commentInput}
                                value={newComment}
                                onChangeText={setNewComment}
                                placeholder="Add a comment..."
                                multiline
                            />
                            <TouchableOpacity onPress={handleAddComment}>
                                <Text style={styles.addCommentButton}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                data={recipe.comments || []}
                renderItem={renderCommentItem}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    flatList: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: 'black',
        resizeMode: 'cover',
    },
    userName: {
        marginTop: 6,
        marginBottom: 12,
        fontSize: 14,
        fontStyle: 'italic'
    },
    containerRow: {
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
    },
    descriptionContainer: {
        paddingLeft: 10
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    ingredientsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 8,
    },
    ingredients: {
        fontSize: 16,
        marginBottom: 16,
    },

    directionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 8,
    },
    directions: {
        fontSize: 16,
        marginBottom: 20,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
        fontSize: 16,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    commentHeader: {
        justifyContent: 'center',
        marginRight: 6
    },
    commentCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentCount: {
        marginLeft: 5,
        fontSize: 16,
    },
    commentItem: {
        marginBottom: 10,
        marginTop: 4,
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    commentUsername: {
        fontWeight: 'bold',
        fontSize: 16
    },
    commentText: {
        fontSize: 12
    },
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: 'white',
    },
    commentInput: {
        flex: 1,
        borderWidth: 0.4,
        borderColor: '#D9D9D9',
        padding: 6,
        marginRight: 10,
        maxHeight: 100,
    },
    addCommentButton: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default CategoryRecipeDetail;
