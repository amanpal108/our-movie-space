export const config = {
    logoCount: 6,
    firebaseConfig: {
        apiKey: "AIzaSyBjbM2haPtKyrD23jGgzV2k_Y3XIxBNtLw",
        authDomain: "universal-chain-280821.firebaseapp.com",
        projectId: "universal-chain-280821",
        storageBucket: "universal-chain-280821.appspot.com",
        messagingSenderId: "561057874596",
        appId: "1:561057874596:web:113a411691825b6bbddc31",
        measurementId: "G-6DSHX47MEZ"
    },
    servers: {
        iceServers: [
            {
            urls: ['stun:stun1.l.google.com:19302',
                   'stun:stun2.l.google.com:19302'],
            },
        ],
        iceCandidatePoolSize: 10,
    },
    DEV: "development" === 'development',
}

