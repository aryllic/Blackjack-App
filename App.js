import { Appearance, AppState } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Sound from 'react-native-sound';

import { store, persistor } from './src/redux/store.js';
import { setOpenWindow } from './src/redux/openWindowSlice.js';
import { setErrorWindowMsg } from './src/redux/errorWindowMsgSlice.js';
import { setMoney } from './src/redux/moneySlice.js';

import HomeScreen from './src/screens/home';
import LobbiesScreen from './src/screens/lobbies';
import LobbyCreateScreen from './src/screens/lobbyCreate';
import LobbyScreen from './src/screens/lobby';
import GameScreen from './src/screens/game';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

function AppWrapper(props) {
  const money = useSelector(state => state.money.money);
  const settings = useSelector(state => state.settings.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    Appearance.setColorScheme("dark");

    backGroundMusic = new Sound("menu_music.mp3", Sound.MAIN_BUNDLE, () => {
      backGroundMusic.setNumberOfLoops(-1);
      backGroundMusic.stop(() => {
        backGroundMusic.play();

        if (!settings.enableMusic) {
          backGroundMusic.setVolume(0);
        } else {
          backGroundMusic.setVolume(0.5);
        };
      });
    });

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState == "background") {
        backGroundMusic.pause();
      } else {
        backGroundMusic.play();
      };
    };

    const stateListener = AppState.addEventListener("change", handleAppStateChange);

    if (money < 10000) {
      dispatch(setErrorWindowMsg("You are out of money!"));
      dispatch(setOpenWindow("ErrorWindow"));
      dispatch(setMoney(100000));
    };

    return () => {
      stateListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!settings.enableMusic) {
      backGroundMusic.setVolume(0);
    } else {
      backGroundMusic.setVolume(0.5);
    };
  }, [settings]);
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWrapper />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Lobbies" component={LobbiesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LobbyCreate" component={LobbyCreateScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Lobby" component={LobbyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

//TODO: FIX BUG WITH PLAYER VIEW BEING RENDERED AT THE TOP WHEN ANOTHER PLAYER SPLITS (ALIGN SELF TO FLEX END)

// cd android
// ./gradlew assembleRelease
