import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ParentHomeScreen = () => {
  const { logout } = useAuthStore();
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleLogout = useCallback(() => {
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
  }, [logout, navigation]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 12 }]}>
        {/* TODO: Add svg icon for menu */}
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
          {/* TODO: Add svg icon for logout */}
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { paddingBottom: bottom + 24 }]}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Panel de padres</Text>
          <Text style={styles.description}>
            Desde acá vas a poder monitorear la actividad de tus hijos, gestionar
            alertas y configurar reglas de uso.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* TODO: Implement activity monitoring */}
          <View style={styles.card}>
            <Ionicons
              name="chatbubbles-outline"
              size={32}
              color={colors.accent.mainBlue}
            />
            <Text style={styles.cardTitle}>Actividad</Text>
            <Text style={styles.cardDescription}>
              Revisá las conversaciones y el uso de la IA.
            </Text>
          </View>

          {/* TODO: Implement alerts/notifications */}
          <View style={styles.card}>
            <Ionicons
              name="notifications-outline"
              size={32}
              color={colors.accent.mainBlue}
            />
            <Text style={styles.cardTitle}>Alertas</Text>
            <Text style={styles.cardDescription}>
              Notificaciones basadas en las reglas configuradas.
            </Text>
          </View>

          {/* TODO: Implement rules management */}
          <View style={styles.card}>
            <Ionicons
              name="shield-checkmark-outline"
              size={32}
              color={colors.accent.mainBlue}
            />
            <Text style={styles.cardTitle}>Reglas</Text>
            <Text style={styles.cardDescription}>
              Gestioná los controles parentales y palabras clave.
            </Text>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeSection: {
    gap: 12,
    marginBottom: 32,
  },
  greeting: {
    fontFamily: fonts.raleway.extraBold,
    fontSize: 32,
    color: colors.accent.mainBlue,
    includeFontPadding: false,
  },
  description: {
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    color: colors.neutral[500],
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.accent.mainBlue,
  },
  cardDescription: {
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    color: colors.neutral[500],
    lineHeight: 20,
  },
});

export default ParentHomeScreen;
