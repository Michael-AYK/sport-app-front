import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import Gravatar from './Gravatar';

const ParticipantsModal = ({ visible, user, availableUsers, onClose, onUpdateParticipants, onNextPress, theme }: any) => {
    const [input, setInput] = useState('');
    const [participants, setParticipants] = useState([user]); // Commence avec l'utilisateur actuel

    // Exclut les participants déjà ajoutés du filtre
    const filteredUsers = availableUsers.filter((u: any) => {
        const isAlreadyParticipant = participants.some((p: any) => p.email === u.email);
        return !isAlreadyParticipant &&
            ((u.nom && u.nom.toLowerCase().includes(input.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(input.toLowerCase())));
    });

    // Ajoute un participant à la liste
    const addParticipant = (participant: any) => {
        const newParticipants = [...participants, participant];
        setParticipants(newParticipants);
        setInput(''); // Réinitialise l'entrée après l'ajout
        onUpdateParticipants(newParticipants); // Mise à jour de la liste dans le composant parent
    };


    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContent}>
                <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                    <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Ajouter des participants</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Recherchez un nom ou un email"
                        value={input}
                        onChangeText={setInput}
                        style={[styles.input, { flex: 1 }]}
                    />
                    <Text style={styles.searchIcon}>🔍</Text>
                </View>
                {input.length > 1 && (
                    <View style={styles.suggestionsContainer}>
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item, index) => 'fil' + index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => addParticipant(item)} style={styles.suggestionItem}>
                                    <Text numberOfLines={1}>{item.nom} ({item.email})</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
                <FlatList
                    data={participants}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
                        <Gravatar
                            style={{}}
                            s={25}
                            email={item?.email}
                        />

                        <Text numberOfLines={1} style={styles.participant}>{item.name || item.nom} ({item.email})</Text>
                    </View>}
                    style={styles.participantsList}
                />
                <TouchableOpacity onPress={() => {
                    onClose();
                    onNextPress();
                }} style={[styles.continueButton, { backgroundColor: theme.primary }]}>
                    <Text style={styles.continueButtonText}>Continuer</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        marginVertical: 10
    },
    participant: {
        fontSize: 14,
        fontWeight: '300',
        marginVertical: 5,
        marginLeft: 8
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbb',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
    },
    input: {
        fontSize: 14,
        flex: 1, // Assurez-vous que le TextInput remplit l'espace disponible
    },
    searchIcon: {
        marginLeft: 10,
        fontSize: 20,
        color: '#bbb',
    },

    suggestionsContainer: {
        maxHeight: 200, // Ajustez cette valeur selon vos besoins
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    participantsList: {
        flexGrow: 0, // Empêche la liste de pousser les autres éléments
        marginBottom: 10,
    },
    continueButton: {
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        width: '100%',
        alignSelf: 'center'
    },
    continueButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    closeIcon: {
        position: 'absolute',
        right: 5,
        top: 0,
        padding: 20,
    },
    closeIconText: {
        fontSize: 20,
        color: 'black',
    },
});

export default ParticipantsModal;
