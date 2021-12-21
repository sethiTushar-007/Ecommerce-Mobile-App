import React, { useEffect, useCallback } from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { authenticate, setDidTryAL } from '../../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();

    const tryLogin = useCallback(async() => {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
            dispatch(setDidTryAL());
            return;
        }
        const transformedData = JSON.parse(userData);
        const {token, userId, expiryDate} = transformedData;
        const expirationDate = new Date(expiryDate);

        if (expirationDate <= new Date() || !token || !userId) {
            dispatch(setDidTryAL());
            return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();

        dispatch(authenticate(userId, token, expirationTime));
    }, [dispatch]);

    useEffect(() => {
        tryLogin();
    }, []);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen;