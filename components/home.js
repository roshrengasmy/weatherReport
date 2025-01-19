import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Entypo';
import { debounce } from 'lodash';
import { fetchLocationApi, fetchWeatherApi } from '../services/weatherApi';
import { weatherImages } from '../constants/constant';
import { setData, getData } from '../services/asyncStorage';

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locationData, setlocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'New Delhi';
    if (myCity) cityName = myCity;
    fetchWeatherApi({ city: cityName, days: 7 })
      .then((res) => {
        setWeather(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error in fetching weather api', err);
        setLoading(false);
      });
  };

  const handleLocation = (location) => {
    setlocation([]);
    setLoading(true);
    setShowSearch(false);
    fetchWeatherApi({ city: location?.name, days: '7' })
      .then((res) => {
        setWeather(res);
        setLoading(false);
        setData('city', location?.name);
      })
      .catch((err) => {
        console.log('Error in fetching weather api', err);
        setLoading(false);
      });
  };

  const handleSearch = (value) => {
    if (value?.length > 2) {
      setLoading(true);
      fetchLocationApi({ city: value })
        .then((res) => {
          setLoading(false);
          setlocation(res);
        })
        .catch((err) => {
          setLoading(false);
          console.log('Error in fetching location api', err);
        });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location, forecast } = weather;

  const convertDateToDay = (value) => {
    let date = new Date(value);
    let options = { weekday: 'long' };
    let dayName = date?.toLocaleDateString('en-US', options);
    return dayName.split(',')[0];
  };

  return (
    // <ThemeConsumer>
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style={'light'} />
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      {!loading ? (
        <SafeAreaView style={{ flex: 1 }}>
          // Search Bar section
          <View
            style={{
              height: '7%',
              marginHorizontal: 20,
              marginTop: 50,
              position: 'realtive',
              zIndex: 50,
            }}>
            <View
              style={{
                backgroundColor: showSearch
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: 25,
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search city"
                  placeholderTextColor={'lightgray'}
                  style={{
                    paddingLeft: 10,
                    flex: 1,
                    color: 'white',
                    fontSize: 18,
                  }}
                />
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  setShowSearch(!showSearch);
                }}
                style={{
                  borderRadius: 25,
                  padding: 15,
                  margin: 5,
                  backgroundColor: 'rgba(225,225,225,0.3)',
                }}>
                <Icon name="magnifying-glass" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {locationData?.length > 0 && showSearch ? (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  backgroundColor: '#d1d5db',
                  top: 65,
                  borderRadius: 25,
                }}>
                {locationData?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleLocation(item);
                    }}
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      marginBottom: 5,
                      borderBottomWidth:
                        locationData?.length - 1 == index ? 0 : 1,
                      borderBlockColor: 'gray',
                    }}>
                    <Icon
                      name="location-pin"
                      size={18}
                      color="gray"
                      style={{ padding: 5 }}
                    />
                    <Text style={{ color: 'black', fontSize: 18 }}>
                      {item?.name}, {item?.country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
          // Forecast section
          <View
            style={{
              marginHorizontal: 20,
              flex: 1,
              justifyContent: 'space-around',
            }}>
            // Location section
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 24,
              }}>
              {location?.name},
              <Text
                style={{
                  color: '#d1d5db',
                  fontWeight: '600',
                  fontSize: 18,
                }}>
                {' ' + location?.country}
              </Text>
            </Text>
            // Weather section
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                source={
                  weatherImages[current?.condition?.text]
                    ? weatherImages[current?.condition?.text]
                    : weatherImages['other']
                }
                style={{ width: 200, height: 200 }}
              />
            </View>
            // Degree celcius
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 60,
                  marginLeft: 5,
                }}>
                {current?.temp_c}°
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 30,
                  marginLeft: 5,
                }}>
                {current?.condition?.text}
              </Text>
            </View>
            // Other stats
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              // wind
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/icons/wind.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                    paddingHorizontal: 5,
                  }}>
                  {current?.wind_kph}
                </Text>
              </View>
              // humidity
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/icons/drop.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                    paddingHorizontal: 5,
                  }}>
                  {current?.humidity}
                </Text>
              </View>
              // sun
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/icons/sun.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                    paddingHorizontal: 5,
                  }}>
                  {forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          // Forecast for next days
          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <Icon name="calendar" size={18} color="white" />
              <Text
                style={{ color: 'white', fontSize: 18, paddingHorizontal: 10 }}>
                Daily Forecast
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}>
              {forecast?.forecastday?.map((item, index) => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 110,
                      borderRadius: 25,
                      marginRight: 20,
                      marginVertical: 10,
                      padding: 15,
                      backgroundColor: 'rgba(225,225,225,0.15)',
                    }}>
                    <Image
                      source={
                        weatherImages[item?.day?.condition?.text]
                          ? weatherImages[item?.day?.condition?.text]
                          : weatherImages['other']
                      }
                      style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'white' }}>
                      {convertDateToDay(item?.date)}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 28,
                      }}>
                      {item?.day?.avgtemp_c}°
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 30 }}>Loading...</Text>
        </View>
      )}
    </View>
    // </ThemeConsumer>
  );
};

export default Home;
