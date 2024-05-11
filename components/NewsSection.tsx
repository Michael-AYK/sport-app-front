import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
// Simulons des données pour les articles
const articles = [
  {
    id: 1,
    titre: "Découverte du nouveau court",
    created_at: "2022-01-01",
    coverImage: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1470"
  },
  {
    id: 2,
    titre: "Événement spécial été 2022",
    created_at: "2022-02-01",
    coverImage: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1474"
  },
  {
    id: 3,
    titre: "Conseils pour améliorer votre jeu",
    created_at: "2022-03-01",
    coverImage: "https://plus.unsplash.com/premium_photo-1666975641882-950fa381cbc2?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1374"
  },
  {
    id: 4,
    titre: "Les bienfaits du padel",
    created_at: "2022-04-01",
    coverImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1470"
  },
];

const NewsSection = () => {
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const styles = StyleSheet.create({
    newsSection: {
      paddingVertical: 10,
    },
    newsTitle: {
      fontSize: 18,
      fontWeight: '900',
      marginBottom: 5,
      marginTop: 15,
      color: theme.primaryText, // Utilisation de `theme` pour le texte
    },
    articleItem: {
      flexDirection: 'row',
      marginBottom: 15,
      backgroundColor: theme.primaryBackground, // Utilisation de `theme` pour l'arrière-plan
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 1
    },
    articleImage: {
      width: "100%",
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      height: 100,
      overflow: 'hidden'
    },
    articleTextContainer: {
      flex: 1,
      padding: 10,
    },
    articleTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.primaryText, // Utilisation de `theme` pour le texte
      marginBottom: 10
    },
    articleDate: {
      fontSize: 12,
      color: theme.primaryTextLight, // Utilisation de `theme` pour le texte secondaire
      marginTop: 5,
      position: 'absolute',
      right: 10,
      bottom: 10,
      fontStyle: 'italic'
    },
  });


  return (
    <View style={styles.newsSection}>
      <Text style={styles.newsTitle}>Articles récents</Text>
      <FlatList
        data={articles}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }: any) => {

            <Image source={{ uri: item.coverImage }} style={styles.articleImage} />
          return <TouchableOpacity style={{ position: 'relative', elevation: 10, overflow: 'hidden', width: '47.5%', marginVertical: 10, marginRight: index % 2 === 0 ? '5%': 0 }}>
            <View style={styles.articleImage}>
                    <Image source={{ uri: item.coverImage }} style={{ width: '100%', height: '100%' }} />
                    <View style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: theme.primary,
                        opacity: 0.25, // Ajustez l'opacité selon le besoin
                    }} />
                </View>
            <View style={{ marginTop: -20, height: 100, borderRadius: 20, paddingBottom: 40, paddingTop: 15, paddingHorizontal: 10, backgroundColor: theme.primaryBackground }}>
              <Text style={styles.articleTitle} numberOfLines={2}>{item.titre}</Text>
              <Text style={styles.articleDate}>Rédigé le {item.created_at}</Text>
            </View>
          </TouchableOpacity>
        }}
      />
      {/* {articles.map((item: any, index: number) => (
          <TouchableOpacity key={index} style={styles.articleItem}>
            <Image source={{ uri: item.coverImage }} style={styles.articleImage} />
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle}>{item.titre}</Text>
              <Text style={styles.articleDate}>{item.created_at}</Text>
            </View>
          </TouchableOpacity>
        ))} */}
    </View>
  );
};


export default NewsSection;
