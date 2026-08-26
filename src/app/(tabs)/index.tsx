import { useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useBaggageStore } from '@/store/baggageStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const { fetchBaggageDetail, printBarcode, barcodeLoading, barcodeError, zplData, printLoading, printError } = useBaggageStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLoading, setDebugLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await login({ username, password });
      router.push('/(tabs)/explore');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeDebugTest = async () => {
    setDebugLoading(true);

    try {
      await fetchBaggageDetail('f_982374A');
      await printBarcode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Barcode testi sırasında hata oluştu.');
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Flight App Giriş
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.form}>
          <View style={styles.field}>
            <ThemedText type="smallBold">Kullanıcı Adı</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Şifre</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <ThemedText type="small" themeColor="textSecondary">{error}</ThemedText> : null}

          <Pressable
            onPress={handleLogin}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <ThemedText type="smallBold" themeColor="text">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleBarcodeDebugTest}
            style={[styles.button, styles.debugButton, debugLoading && styles.buttonDisabled]}
            disabled={debugLoading}
          >
            <ThemedText type="smallBold" themeColor="text">
              {debugLoading ? 'Barcode testi...' : 'Barcode Test'}
            </ThemedText>
          </Pressable>

          {printError ? (
            <ThemedText type="small" themeColor="textSecondary">
              {printError}
            </ThemedText>
          ) : null}

          {zplData ? (
            <ThemedText type="small" themeColor="textSecondary">
              ZPL hazır: {zplData.slice(0, 120)}...
            </ThemedText>
          ) : null}
        </ThemedView>

        {Platform.OS === 'web' && <ThemedText type="small">Backend çalışırken test edebilirsiniz.</ThemedText>}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    padding: Spacing.three,
    color: '#000',
  },
  button: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    backgroundColor: '#208AEF',
  },
  debugButton: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
