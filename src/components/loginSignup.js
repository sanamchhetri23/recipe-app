import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';

export const Button = ({ title, onPress, color = 'royalblue', disabled = false }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }, disabled && styles.disabledButton]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />
    );
};

export const ErrorText = ({ message }) => {
    if (!message) return null;
    return <Text style={styles.errorText}>{message}</Text>;
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'royalblue',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 6,
        marginBottom: 4,
        alignSelf: 'center',
        marginTop: '6%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});
