// Couleurs de fond des avatars d'initiales (palette de la charte) et couleur de texte lisible sur chacune (contraste ≥ 4,5)
export const AVATAR_COLORS = ['#156F71', '#90BAD1', '#EC7F7A', '#012828', '#177070']
const LIGHT = ['#90BAD1', '#EC7F7A']
export const avatarInk = (bg: string) => (LIGHT.includes(bg.toUpperCase()) ? '#012828' : '#ffffff')
