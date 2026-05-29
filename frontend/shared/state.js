const STORAGE_KEY = 'arcade_global_manifest_v1';

export const ArcadeStorage = {
  get() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { completedDaily: false, lastPlayedDate: null, highScores: {} };
    }
    const state = JSON.parse(data);

    const today = new Date().toISOString().split('T')[0];
    if (state.lastPlayedDate !== today) {
      state.completedDaily = false;
    }
    return state;
  },

  saveDailyComplete(gameId) {
    const state = this.get();
    const today = new Date().toISOString().split('T')[0];

    state.completedDaily = true;
    state.lastPlayedDate = today;
    state.highScores[gameId] = (state.highScores[gameId] || 0) + 1;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};
