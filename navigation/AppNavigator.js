import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import { AuthNavigator, ShopNavigator } from './ShopNavigator';
import StartupScreen from '../screens/user/StartupScreen';

const AppNavigator = props => {
    const didTryAutoLogin = useSelector(state => !!state.auth.didTryAutoLogin);
    const isAuth = useSelector(state => !!state.auth.token);
    return (
        <NavigationContainer>
            {isAuth && <ShopNavigator/>}
            {!isAuth && didTryAutoLogin && <AuthNavigator/>}
            {!isAuth && !didTryAutoLogin && <StartupScreen/>}
        </NavigationContainer>
    );
}

export default AppNavigator;