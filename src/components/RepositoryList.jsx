import React, { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from './useRepositories';
import Text from './Text';
import { useDebounce } from 'use-debounce';
const options = [
  'Latest repositories',
  'Highest rated repositories',
  'Lowest rated repositories',
];

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  message: {
    padding: 16,
  },
  // Header / Trigger styles
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  triggerText: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  // Modal dialog styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  placeholder: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
   const navigate = useNavigate();

  const [selected, setSelected] = useState('Latest repositories');
   const [isOpen, setIsOpen] = useState(false);
    const [isfiltered, setIsfiltered] = useState('');
const [debouncedSearch] = useDebounce(isfiltered, 500);


   const {
     repositories,
     loading,
     error,
     refetch,
   } = useRepositories(debouncedSearch);
   
   const sortedRepositories =
  selected === 'Highest rated repositories'
    ? [...repositories].sort(
        (a, b) => b.ratingAverage - a.ratingAverage
      )
    : selected === 'Lowest rated repositories'
      ? [...repositories].sort(
          (a, b) => a.ratingAverage - b.ratingAverage
        )
      : repositories;
  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  
  return (
    <>
    <Searchbar
      placeholder="Search"
      onChangeText={setIsfiltered}
      value={isfiltered}
    />
      {/* Dropdown Selector Trigger */}
      <Pressable style={styles.pickerTrigger} onPress={() => setIsOpen(true)}>
        <Text style={styles.triggerText}>{selected}</Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      {/* React Native Modal Dialog */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dialogCard}>
                <Text style={styles.placeholder}>Select an item...</Text>
                {options.map((item, index) => (
                  <Pressable
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Repository List */}
      <FlatList
        data={sortedRepositories}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
            <RepositoryItem item={item} showGithubButton={false} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.message}>
            <Text>
              {loading
                ? 'Loading repositories...'
                : error
                  ? error.message
                  : 'No repositories found.'}
            </Text>
            {error && <Button title="Try again" onPress={refetch} />}
          </View>
        }
      />
    </>
  );
};

export default RepositoryList;