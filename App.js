import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/home'

export default function App() {
  const Stack = createStackNavigator()
  return (
    <NavigationContainer>
    <Stack.Navigator >
     <Stack.Screen  
     name="Home"
     component={Home}
     options={{headerShown:false}} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

