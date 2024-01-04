// exports.generateReferralCode = () => {
//     return Math.random().toString(36).slice(2)
// }

exports.generateReferralCode = () => {
    const length = 10;
    const characters = 'abcdefghijABCDEFGHIJ0123456789';

    let referralCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        
        referralCode += characters.charAt(randomIndex);
    }

    return referralCode;
};
