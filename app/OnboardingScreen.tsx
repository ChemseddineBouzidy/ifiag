// screens/OnboardingCustom.tsx
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/images/OnboardingScreen/1.png'),
    title: 'Bienvenue sur Ifiage',
    description: 'Gérez vos cours, vos devoirs et votre emploi du temps, le tout au même endroit.',
    backgroundColor: '#FF6600'
  },
  {
    id: '2',
    image: require('../assets/images/OnboardingScreen/2.png'),
    title: 'Organisez vos cours',
    description: 'Créez et gérez facilement vos emplois du temps et vos cours.',
    backgroundColor: '#4CAF50'
  },
  {
    id: '3',
    image: require('../assets/images/OnboardingScreen/3.png'),
    title: 'Suivez vos progrès',
    description: 'Visualisez votre progression et restez motivé dans vos études.',
    backgroundColor: '#2196F3'
  }
];

export default function OnboardingCustom() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      router.replace('/auth/login');
    }
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.topContainer}>
          <Image
            source={item.image}
            style={styles.image}
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.description}</Text>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.nextButton, { backgroundColor: item.backgroundColor }]} onPress={handleNext}>
              <Text style={styles.nextArrow}>
                {currentIndex === slides.length - 1 ? '✓' : '→'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: slides[currentIndex].backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
  topContainer: {
    flex: 2,
    alignItems: 'center',
    // justifyContent: 'flex-end',

  },
  image: {
    width: "100%",
    height: height * 0.55,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop:57
  },
  bottomContainer: {
    flex: 1.5,
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  title: {
    fontSize: 28,
    marginTop: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E1E1E',
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    opacity:0.8,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom:44,
    
  },
  skip: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextArrow: {
    fontSize: 20,
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 20,
  },
});