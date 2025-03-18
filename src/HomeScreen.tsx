// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { HomeScreenNavigationProp } from './types/navigation';

// type Props = {
//   navigation: HomeScreenNavigationProp;
// };

// const HomeScreen: React.FC<Props> = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details', { message: 'Hello from Home!' })}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
// });

// export default HomeScreen;


import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, } from 'react-native';
import { TVEventHandler } from 'react-native'
import axios from 'axios';
import { LRUCache } from 'lru-cache';
import { NavigationProp } from '@react-navigation/native'; // Import NavigationProp

// Define the navigation parameters
type RootStackParamList = {
  Home: undefined;
  Movie: { movieId: string }; // Adjust this to match your navigation structure
};

// Define the type for the navigation prop
type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

// Define the props for the HomeScreen component
type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const cache = new LRUCache({ max: 100, ttl: 1000 * 60 * 5 });

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [movies, setMovies] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const cachedMovies = cache.get('movies') as { id: string; title: string }[] | undefined;
      if (cachedMovies) {
        setMovies(cachedMovies);
        return;
      }

      const response = await axios.get<{ id: string; title: string }[]>('http://your-backend-api/movies');
      cache.set('movies', response.data);
      setMovies(response.data);
    };

    fetchMovies();
  }, []);


  
  // Handle remote control events
  useEffect(() => {
    const tvEventHandler = new TVEventHandler();
    tvEventHandler.enable(null, (_, evt) => {
      if (evt.eventType === 'up') {
        console.log('Up button pressed');
      } else if (evt.eventType === 'down') {
        console.log('Down button pressed');
      }
    });

    return () => tvEventHandler.disable();
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.title}
            onPress={() => navigation.navigate('Movie', { movieId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;
