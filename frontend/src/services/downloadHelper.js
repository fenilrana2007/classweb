import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const downloadFile = async (content, filename, mimeType = 'text/csv') => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Write the file locally to Cache or Documents directory so it can be shared
      const base64Data = btoa(unescape(encodeURIComponent(content)));
      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache, // Cache is always writable and safe for temporary sharing
      });

      // Open Native Share Sheet to send via WhatsApp, Email, or save to files
      await Share.share({
        title: `Share ${filename}`,
        text: `Here is the exported ${filename}`,
        url: writeResult.uri,
        dialogTitle: `Export and Share ${filename}`,
      });
    } catch (err) {
      alert(`Export Failed: ${err.message || err}`);
    }
  } else {
    // Standard web browser download
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
