import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { firestore, auth } from '../database/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export const CategoryRecipeDetail = ({ route }) => {
    const { recipeId } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [newComment, setNewComment] = useState('');
    const currentUser = auth.currentUser;

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
                setIsLiked(updatedRecipeData.likedBy && updatedRecipeData.likedBy.includes(currentUser.uid));
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
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment');
        }
    };

    if (!recipe) {
        return <Text>Loading...</Text>;
    }

    const renderItem = ({ item, index }) => {
        if (index === 0) {
            return (
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
                        <View style={styles.commentCounts}>
                            <Text style={styles.commentCount}>{recipe.comments ? recipe.comments.length : 0}</Text>
                            <Ionicons name="people" size={22} color="black" />
                        </View>
                    </View>

                    <Text style={styles.description}>{recipe.description}</Text>
                    <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                    <Text style={styles.ingredients}>{recipe.ingredients}</Text>
                    <Text style={styles.directionsTitle}>Directions:</Text>
                    <Text style={styles.directions}>{recipe.directions}</Text>

                    <Text style={styles.commentsTitle}>Comments:</Text>
                </View>
            );
        } else {
            const comment = recipe.comments[index - 1];
            return (
                <View style={styles.commentItem}>
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text>{comment.text}</Text>
                </View>
            );
        }
    };

    const data = [{ id: 'recipe_details' }, ...(recipe.comments || [])];

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.addCommentContainer}>
                <TextInput
                    style={styles.commentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                />
                <TouchableOpacity onPress={handleAddComment}>
                    <Text style={styles.addCommentButton}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
    image: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: 'black',
        resizeMode: 'cover',
    },
    userName: {
        marginTop: 12,
        marginBottom: 12,
        fontSize: 16,
        fontWeight: 'bold',
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
    commentCounts:{
        flexDirection: 'row'
    },
    commentCount:{
        marginRight: 5
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    commentItem: {
        marginBottom: 10,
    },
    commentUsername: {
        fontWeight: 'bold',
    },
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    addCommentButton: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default CategoryRecipeDetail;
