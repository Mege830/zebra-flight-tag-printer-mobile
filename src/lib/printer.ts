import {
  HititZebraPrinterEmitter,
  checkStatus as zebraCheckStatus,
  connect as zebraConnect,
  disconnect as zebraDisconnect,
  discoverPrinters as zebraDiscover,
  print as zebraPrint
} from 'hitit-zebra-printer';
import { PermissionsAndroid, Platform } from 'react-native';

export const printerEmitter = HititZebraPrinterEmitter;

export const discoverPrinters = () => zebraDiscover();
export const connectPrinter = (mac: string) => zebraConnect(mac);
export const printZpl = (data: string) => zebraPrint(data);
export const checkPrinterStatus = () => zebraCheckStatus();
export const disconnectPrinter = () => zebraDisconnect();

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