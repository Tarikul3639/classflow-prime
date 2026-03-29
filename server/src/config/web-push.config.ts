export default () => ({
    webPush: {
        mailto: process.env.VAPID_MAILTO || '',
        publicKey: process.env.VAPID_PUBLIC_KEY || '',
        privateKey: process.env.VAPID_PRIVATE_KEY || '',
    },
});

