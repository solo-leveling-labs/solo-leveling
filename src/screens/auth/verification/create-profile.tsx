import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import CalendarIcon from "@/assets/svg/calendar.svg";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getDefaultPickerDate = (): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 8);
  return date;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

const CreateProfileScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { push } = useRouter();
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const isFormValid = name.trim().length > 0 && birthDate !== null;

  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleDateConfirm = useCallback(
    (date: Date) => {
      hideDatePicker();
      setBirthDate(date);
    },
    [hideDatePicker],
  );

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    // TODO: Navigate to next profile setup screen
    push("/");
  }, [isFormValid, push]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "¿Cancelar configuración?",
      "Si salís ahora, tu sesión se cerrará. La próxima vez que inicies sesión podrás continuar desde acá.",
      [
        { text: "Seguir configurando" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => logout(),
        },
      ],
    );
  }, [logout]);

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.buho}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: safeTop + 80, paddingBottom: safeBottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Creá un perfil</Text>
            <Text style={styles.subtitle}>
              Configurá el perfil de tu hijo o hija para que comience a usar
              Zapienz.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Datos</Text>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nombre del menor</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholder="Nombre"
                    placeholderTextColor={colors.neutral[500]}
                    accessibilityLabel="Nombre del menor"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Edad</Text>
                <Pressable
                  style={styles.inputContainer}
                  onPress={showDatePicker}
                  accessibilityLabel={t("auth.signUp.birthDateInputA11y")}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.dateText,
                      !birthDate && styles.dateTextPlaceholder,
                    ]}
                  >
                    {birthDate
                      ? formatDate(birthDate)
                      : t("auth.signUp.selectDate")}
                  </Text>
                  <CalendarIcon
                    width={22}
                    height={22}
                    style={styles.calendarIcon}
                  />
                </Pressable>
                <Text style={styles.helperText}>
                  Zapienz adapta sus respuestas para que sean fáciles de
                  entender según la edad.
                </Text>
              </View>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
            date={birthDate ?? getDefaultPickerDate()}
            confirmTextIOS={t("auth.signUp.datePickerConfirm")}
            cancelTextIOS={t("auth.signUp.datePickerCancel")}
            locale={t("auth.signUp.datePickerLocale")}
            pickerContainerStyleIOS={styles.datePickerIOS}
            customConfirmButtonIOS={({ onPress }) => (
              <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                  styles.datePickerConfirmButton,
                  pressed && styles.datePickerConfirmPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t("auth.signUp.datePickerConfirm")}
              >
                <Text style={styles.datePickerConfirmText}>
                  {t("auth.signUp.datePickerConfirm")}
                </Text>
              </Pressable>
            )}
          />

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                !isFormValid && styles.nextButtonDisabled,
                pressed && isFormValid && styles.buttonPressed,
              ]}
              onPress={handleNext}
              disabled={!isFormValid}
              accessibilityLabel="Siguiente paso"
              accessibilityRole="button"
              accessibilityState={{ disabled: !isFormValid }}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !isFormValid && styles.nextButtonTextDisabled,
                ]}
              >
                Siguiente
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [pressed && styles.buttonPressed]}
              accessibilityLabel="Cancelar la configuración del perfil"
              accessibilityRole="button"
            >
              <Text style={styles.backText}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  flex: {
    flex: 1,
  },
  decorations: {
    position: "absolute",
    top: 0,
    right: -10,
  },
  buho: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 56,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    lineHeight: 57.6,
    letterSpacing: -0.96,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  formSection: {
    gap: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 19.6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.accent.mainBlue,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    height: 48,
    paddingHorizontal: 24,
    lineHeight: 22.4,
    includeFontPadding: false,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    paddingHorizontal: 24,
    lineHeight: 48,
  },
  dateTextPlaceholder: {
    color: colors.neutral[500],
  },
  calendarIcon: {
    position: "absolute",
    right: 20,
  },
  datePickerIOS: {
    alignItems: "center",
  },
  datePickerConfirmButton: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[700],
  },
  datePickerConfirmPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  datePickerConfirmText: {
    fontSize: 20,
    color: "#0081FF",
  },
  helperText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 16,
    letterSpacing: 0.4,
    paddingHorizontal: 24,
  },
  footer: {
    alignItems: "center",
    gap: 16,
    marginTop: "auto",
  },
  nextButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  nextButtonDisabled: {
    backgroundColor: colors.neutral.disabled,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
    lineHeight: 22.4,
  },
  nextButtonTextDisabled: {
    color: colors.neutral[500],
  },
  backText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
});

export default CreateProfileScreen;
