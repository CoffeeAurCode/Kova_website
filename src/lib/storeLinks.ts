// Where "Download Entrava" goes, in one place (it was pasted into two files).
//
// PLAY_STORE_URL is deliberately null until the Google Play listing is live
// (Entrava Remaining Dev Items #6). Setting it is the whole launch step for the
// website: every Google Play button appears, and Android visitors' "Download"
// buttons go to Play instead of the App Store. The URL is
// https://play.google.com/store/apps/details?id=<package> — use the package the
// Play listing was actually created with (com.kova.app is unavailable in Play
// Console; see the app repo's TODO.md).
export const APP_STORE_URL = 'https://apps.apple.com/in/app/entrava-nightlife/id6789246261'
export const PLAY_STORE_URL: string | null = null

const isAndroid = () =>
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)

/** The store this visitor can actually install from. */
export const primaryDownloadUrl = () =>
  PLAY_STORE_URL && isAndroid() ? PLAY_STORE_URL : APP_STORE_URL
