import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SignInScreen = () => {
  const { push } = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    login();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="school-outline" size={56} color="#1A1A2E" />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Password input"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignIn}
            accessibilityLabel="Sign in button"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => push("/(auth)/sign-up")}
          accessibilityLabel="Go to sign up"
          accessibilityRole="link"
          style={styles.footerButton}
        >
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>

          <Text style={styles.linkText}>Sign Up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A2E",
  },
  button: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  footerButton: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  linkText: {
    fontSize: 15,
    color: "#1A1A2E",
    fontWeight: "600",
  },
});

export default SignInScreen;
