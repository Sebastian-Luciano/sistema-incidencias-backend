// hashAdmin.js
import bcrypt from "bcryptjs";

const run = async () => {
    const hash = await bcrypt.hash("abcdef", 10);
   // console.log("Hash de admin123:", hash);
   console.log("Hash de Maria P:", hash);
};

run();

// Hash de admin123: $2b$10$eqsEMIb6TwD5aPlB1ZKXreowSeNxaDxKPV5mxfilnh0QPWFm1Is4y
// Hash de Luciano M (123456): $2b$10$jbzFIvsPBNfR.TkOIKw0ZeretDikI3fwtPJCb7aAtC/TwgDpvoJ.q
// Hash de Maria P (abcdef): $2b$10$g9pooShheiPNXm6ItQW57Okw.iUizquez9jABOLWKxTGW8Wahrbt6
// Hash de pendiente (pendiente123): $2b$10$DV7Mdd3TgxhcinqOvND/X.z9PU.Bh6aRZi5Pr5vtd.Q9DzfbkMOGi