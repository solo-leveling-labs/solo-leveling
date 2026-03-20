import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WELCOME_MESSAGE =
  "¡Hola! Soy Zapienz, tu amiga IA. ¿En qué te puedo ayudar hoy?";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

interface MessageBubbleProps {
  text: string;
}

const BotMessage = ({ text }: MessageBubbleProps) => (
  <View style={messageStyles.botRow}>
    <View style={messageStyles.avatar}>
      <Ionicons name="sparkles" size={16} color={colors.accent.mainBlue} />
    </View>
    <View style={messageStyles.botBubble}>
      <Text style={messageStyles.botText}>{text}</Text>
    </View>
  </View>
);

const UserMessage = ({ text }: MessageBubbleProps) => (
  <View style={messageStyles.userRow}>
    <View style={messageStyles.userBubble}>
      <Text style={messageStyles.userText}>{text}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const { logout } = useAuthStore();
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler({
    onMove: (event) => {
      "worklet";
      keyboardHeight.value = event.height;
    },
  });

  const keyboardSpacerStyle = useAnimatedStyle(() => {
    "worklet";
    return { height: keyboardHeight.value + 12 };
  });

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: WELCOME_MESSAGE },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Scroll to bottom after message is added
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "(auth)" }],
            }),
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          style={styles.headerIconButton}
          accessibilityLabel="Menú"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={24} color={colors.neutral.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Zapienz</Text>

        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={handleLogout}
          style={styles.headerIconButton}
          accessibilityLabel="Cerrar sesión"
          accessibilityRole="button"
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) =>
          message.role === "bot" ? (
            <BotMessage key={message.id} text={message.text} />
          ) : (
            <UserMessage key={message.id} text={message.text} />
          ),
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribí tu mensaje..."
          placeholderTextColor={colors.neutral[700]}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          accessibilityLabel="Campo de mensaje"
        />
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          accessibilityLabel="Enviar mensaje"
          accessibilityRole="button"
        >
          <Ionicons name="send" size={20} color={colors.neutral.white} />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          { paddingBottom: bottom, backgroundColor: colors.neutral.white },
          keyboardSpacerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.accent.mainBlue,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: colors.neutral.white,
    fontFamily: fonts.raleway.bold,
    fontSize: 20,
  },
  headerIconButton: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.disabled,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    color: colors.neutral[200],
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 24,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});

const messageStyles = StyleSheet.create({
  botRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 8,
    maxWidth: "80%",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.neutral.white,
    borderColor: colors.neutral.disabled,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  botBubble: {
    backgroundColor: colors.neutral.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  botText: {
    color: colors.neutral[200],
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  userRow: {
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: colors.accent.mainBlue,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userText: {
    color: colors.neutral.white,
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HomeScreen;
