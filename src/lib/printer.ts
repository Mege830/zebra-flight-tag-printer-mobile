import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from 'react-native';

const { ZebraPrinterModule } = NativeModules;

export const printerEmitter = new NativeEventEmitter(ZebraPrinterModule);

export const discoverPrinters = () => ZebraPrinterModule.discoverPrinters();
export const connectPrinter = (mac: string) => ZebraPrinterModule.connect(mac);
export const printZpl = (data: string) => ZebraPrinterModule.print(data);
export const checkPrinterStatus = () => ZebraPrinterModule.checkStatus();
export const disconnectPrinter = () => ZebraPrinterModule.disconnect();

const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const ensurePrinterConnected = async (macAddress: string) => {
  try {
    const hasPermission = await requestBluetoothPermissions();
    if (!hasPermission) {
      console.log('Bluetooth izinleri reddedildi.');
      return false;
    }

    await connectPrinter(macAddress);
    return true;
  } catch (err) {
    console.log('Printer connect error:', err);
    return false;
  }
};