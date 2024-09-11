import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomModal = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderBlockColor: "black",
    borderWidth: 0,
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "black",
  },
});

export default CustomModal;
