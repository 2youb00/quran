export function normalizeArabicText(text) {
    return (
      text
        // Remove tashkeel (diacritics)
        .replace(/[\u064B-\u065F\u0670]/g, "")
        // Normalize alef variations
        .replace(/[آأإٱ]/g, "ا")
        // Normalize teh marbuta
        .replace(/ة/g, "ه")
        // Normalize ya variations
        .replace(/[ى]/g, "ي")
        // Normalize hamza variations
        .replace(/[ؤئ]/g, "ء")
        // Normalize kaf variations
        .replace(/[ڪ]/g, "ك")
        // Normalize heh variations
        .replace(/[ۀ]/g, "ه")
        // Normalize waw variations
        .replace(/[ؤ]/g, "و")
        // Normalize lam-alef variations
        .replace(/[ﻵﻷﻹﻻﻼ]/g, "لا")
        // Normalize other variations
        .replace(/[ﻱﻲ]/g, "ي")
        .replace(/[ﻻﻼ]/g, "لا")
        .replace(/[ﻷﻹﻵ]/g, "لا")
    );
  }