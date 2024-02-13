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
  {
    id: 5,
    titre: "Rencontre avec un champion",
    created_at: "2022-05-01",
    coverImage: "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1528"
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
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 20,
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
          width: 120,
          height: 100,
        },
        articleTextContainer: {
          flex: 1,
          padding: 10,
        },
        articleTitle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: theme.primaryText, // Utilisation de `theme` pour le texte
        },
        articleDate: {
          fontSize: 12,
          color: theme.primaryTextLight, // Utilisation de `theme` pour le texte secondaire
          marginTop: 5,
          position: 'absolute',
          right: 10,
          bottom: 10
        },
      });

      
  return (
    <View style={styles.newsSection}>
      <Text style={styles.newsTitle}>ACTUALITÉS</Text>
      {articles.map((item: any, index: number) => (
          <TouchableOpacity key={index} style={styles.articleItem}>
            <Image source={{ uri: item.coverImage }} style={styles.articleImage} />
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle}>{item.titre}</Text>
              <Text style={styles.articleDate}>{item.created_at}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};


export default NewsSection;
